import { createClient } from './supabase/server';
import { redis } from './redis';

export async function getDashboardData() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const userId = user.id;

  const cacheKey = `dashboard_data_v2_${userId}`;

  // 1. Check Redis Cache First
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Redis cache error:', e);
    }
  }

  // 2. Fetch from DB
  const { data: trades, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('close_time', { ascending: true });

  if (error || !trades || trades.length === 0) {
    return null; 
  }

  // 3. Aggregate Data
  let netPnl = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let winningTrades = 0;
  const totalTrades = trades.length;

  let currentWinStreak = 0;
  let maxWinStreak = 0;
  let currentLoseStreak = 0;
  let maxLoseStreak = 0;
  
  let currentWinStreakDol = 0;
  let maxWinStreakDol = 0;
  let currentLoseStreakDol = 0;
  let maxLoseStreakDol = 0;

  let longTrades = 0;
  let longWins = 0;
  let shortTrades = 0;
  let shortWins = 0;
  
  let bestTrade = 0;
  let worstTrade = 0;
  
  let sumOfProfits = 0;
  let sumOfSquares = 0;

  let totalDurationMs = 0;

  const dailyPnl: Record<string, { pnl: number, trades: number, wins: number }> = {};
  const cumulativeData: { date: string, value: number }[] = [];
  const drawdownData: { date: string, balance: number, drawdown: number, drawdownPct: number }[] = [];
  let cumulative = 0;
  
  // Extract initial balance from DEAL_TYPE_BALANCE trades
  let assumedInitialBalance = 0;
  trades.forEach(t => {
     if (t.type === 'DEAL_TYPE_BALANCE') {
        assumedInitialBalance += Number(t.profit || 0);
     }
  });
  
  // Drawdown tracking (Starts from captured balance, or 0 if none)
  let currentBalance = assumedInitialBalance;
  let peakBalance = assumedInitialBalance;
  let maxDrawdownDol = 0;
  let maxDrawdownPct = 0;
  let totalCommissions = 0;
  let totalSwaps = 0;

  trades.forEach(trade => {
    // Skip balance deposits for standard P&L trade calculations
    if (trade.type === 'DEAL_TYPE_BALANCE') return;

    const profit = Number(trade.profit) + Number(trade.swap) + Number(trade.commission);
    netPnl += profit;
    
    totalCommissions += Number(trade.commission || 0);
    totalSwaps += Number(trade.swap || 0);
    
    if (profit > bestTrade) bestTrade = profit;
    if (profit < worstTrade) worstTrade = profit;
    
    sumOfProfits += profit;
    sumOfSquares += (profit * profit);

    // Direction splits
    if (trade.type === 'DEAL_TYPE_BUY' || trade.type?.toLowerCase().includes('buy')) {
      longTrades++;
      if (profit > 0) longWins++;
    } else {
      shortTrades++;
      if (profit > 0) shortWins++;
    }

    // Streaks
    if (profit > 0) {
      grossProfit += profit;
      winningTrades++;
      
      currentWinStreak++;
      currentWinStreakDol += profit;
      
      currentLoseStreak = 0;
      currentLoseStreakDol = 0;
      
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
      if (currentWinStreakDol > maxWinStreakDol) maxWinStreakDol = currentWinStreakDol;
    } else {
      grossLoss += Math.abs(profit);
      
      currentLoseStreak++;
      currentLoseStreakDol += Math.abs(profit);
      
      currentWinStreak = 0;
      currentWinStreakDol = 0;
      
      if (currentLoseStreak > maxLoseStreak) maxLoseStreak = currentLoseStreak;
      if (currentLoseStreakDol > maxLoseStreakDol) maxLoseStreakDol = currentLoseStreakDol;
    }

    // Duration (if open_time exists)
    if (trade.open_time && trade.close_time) {
      const open = new Date(trade.open_time).getTime();
      const close = new Date(trade.close_time).getTime();
      totalDurationMs += (close - open);
    }

    // Group by day
    const dateObj = new Date(trade.close_time);
    const dateStr = dateObj.toISOString().split('T')[0];
    const displayDate = dateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });

    if (!dailyPnl[dateStr]) {
      dailyPnl[dateStr] = { pnl: 0, trades: 0, wins: 0 };
    }
    dailyPnl[dateStr].pnl += profit;
    dailyPnl[dateStr].trades += 1;
    if (profit > 0) dailyPnl[dateStr].wins += 1;

    // Cumulative P&L
    cumulative += profit;
    cumulativeData.push({
      date: displayDate,
      value: Number(cumulative.toFixed(2))
    });
    
    // Drawdown curve
    currentBalance += profit;
    if (currentBalance > peakBalance) peakBalance = currentBalance;
    const currentDrawdown = peakBalance - currentBalance;
    const currentDrawdownPct = peakBalance > 0 ? (currentDrawdown / peakBalance) * 100 : 0;
    
    if (currentDrawdown > maxDrawdownDol) maxDrawdownDol = currentDrawdown;
    if (currentDrawdownPct > maxDrawdownPct) maxDrawdownPct = currentDrawdownPct;
    
    drawdownData.push({
      date: displayDate,
      balance: Number(currentBalance.toFixed(2)),
      drawdown: Number(currentDrawdown.toFixed(2)),
      drawdownPct: Number(currentDrawdownPct.toFixed(2))
    });
  });

  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;
  
  const avgWin = winningTrades === 0 ? 0 : grossProfit / winningTrades;
  const avgLoss = (totalTrades - winningTrades) === 0 ? 0 : grossLoss / (totalTrades - winningTrades);

  const avgDurationMs = totalTrades === 0 ? 0 : totalDurationMs / totalTrades;
  const avgDurationMins = avgDurationMs / (1000 * 60);

  // Sharpe Ratio (Trade-level)
  const meanProfit = sumOfProfits / totalTrades;
  const variance = (sumOfSquares / totalTrades) - (meanProfit * meanProfit);
  const stdDev = Math.sqrt(variance > 0 ? variance : 0);
  const sharpeRatio = stdDev === 0 ? 0 : meanProfit / stdDev;
  
  // Recovery Factor
  const recoveryFactor = maxDrawdownDol === 0 ? 0 : Math.abs(netPnl) / maxDrawdownDol;

  const result = {
    kpis: {
      netPnl,
      grossProfit,
      grossLoss,
      profitFactor,
      winRate,
      avgWin,
      avgLoss,
      winningTrades,
      losingTrades: totalTrades - winningTrades,
      totalTrades,
      maxWinStreak,
      maxLoseStreak,
      maxWinStreakDol,
      maxLoseStreakDol,
      avgDurationMins,
      bestTrade,
      worstTrade,
      sharpeRatio,
      recoveryFactor,
      maxDrawdownDol,
      maxDrawdownPct,
      totalCommissions,
      totalSwaps,
      longTrades,
      longWins,
      shortTrades,
      shortWins
    },
    dailyData: dailyPnl,
    cumulativeData,
    drawdownData,
    rawTrades: trades.reverse()
  };

  // 4. Cache Result
  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
    } catch (e) {
      console.error('Redis cache set error:', e);
    }
  }

  return result;
}
