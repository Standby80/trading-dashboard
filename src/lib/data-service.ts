import { createClient } from './supabase/server';
import { redis } from './redis';

export async function getDashboardData() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const userId = user.id;

  const cacheKey = `dashboard_data_${userId}`;

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
  let totalTrades = trades.length;

  let currentWinStreak = 0;
  let maxWinStreak = 0;
  let currentLoseStreak = 0;
  let maxLoseStreak = 0;
  
  let totalDurationMs = 0;

  const dailyPnl: Record<string, { pnl: number, trades: number, wins: number }> = {};
  const cumulativeData: { date: string, value: number }[] = [];
  let cumulative = 0;

  trades.forEach(trade => {
    const profit = Number(trade.profit) + Number(trade.swap) + Number(trade.commission);
    netPnl += profit;

    // Streaks
    if (profit > 0) {
      grossProfit += profit;
      winningTrades++;
      currentWinStreak++;
      currentLoseStreak = 0;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else {
      grossLoss += Math.abs(profit);
      currentLoseStreak++;
      currentWinStreak = 0;
      if (currentLoseStreak > maxLoseStreak) maxLoseStreak = currentLoseStreak;
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

    if (!dailyPnl[dateStr]) {
      dailyPnl[dateStr] = { pnl: 0, trades: 0, wins: 0 };
    }
    dailyPnl[dateStr].pnl += profit;
    dailyPnl[dateStr].trades += 1;
    if (profit > 0) dailyPnl[dateStr].wins += 1;

    // Cumulative P&L
    cumulative += profit;
    cumulativeData.push({
      date: dateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
      value: Number(cumulative.toFixed(2))
    });
  });

  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;
  
  const avgWin = winningTrades === 0 ? 0 : grossProfit / winningTrades;
  const avgLoss = (totalTrades - winningTrades) === 0 ? 0 : grossLoss / (totalTrades - winningTrades);

  const avgDurationMs = totalTrades === 0 ? 0 : totalDurationMs / totalTrades;
  const avgDurationMins = avgDurationMs / (1000 * 60); // Convert to minutes

  const result = {
    kpis: {
      netPnl,
      profitFactor,
      winRate,
      avgWin,
      avgLoss,
      winningTrades,
      losingTrades: totalTrades - winningTrades,
      totalTrades,
      maxWinStreak,
      maxLoseStreak,
      avgDurationMins
    },
    dailyData: dailyPnl,
    cumulativeData,
    rawTrades: trades.reverse() // Reverse to show newest trades first in history table
  };

  // 4. Cache Result
  if (redis) {
    try {
      // Cache for 5 minutes
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
    } catch (e) {
      console.error('Redis cache set error:', e);
    }
  }

  return result;
}
