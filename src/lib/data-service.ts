import { createClient } from './supabase/server';
import { redis } from './redis';

import { createAdminClient } from './supabase/admin';

export async function getDashboardData(period?: string, symbolsStr?: string, accountName: string = 'Default', publicUsername?: string) {
  let supabase = await createClient();
  let userId = null;

  if (publicUsername) {
    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase.from('users').select('id, is_public').eq('username', publicUsername).single();
    if (!profile || !profile.is_public) return null;
    userId = profile.id;
    supabase = adminSupabase;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  // 1. Fetch user profile (always fresh)
  let userProfile = null;
  let reportMaxDrawdown = 0;
  if (userId) {
     const { data: profile } = await supabase.from('users').select('subscription_tier, api_key, trial_ends_at').eq('id', userId).single();
     userProfile = profile;
     
       let reportQuery = supabase.from('reports').select('*').eq('user_id', userId);
       
       if (accountName !== 'All Accounts') {
         reportQuery = reportQuery.eq('account_name', accountName);
       }
       
       const { data: reports, error } = await reportQuery;
       const report = reports && reports.length > 0 ? reports[0] : null;
       
     if (report?.max_drawdown) {
       reportMaxDrawdown = report.max_drawdown;
     }
     
     console.log("VAD FRONTENDEN FÅR FRÅN SUPABASE:", report);
  }

  const cacheKey = `dashboard_data_v3_${userId}_${accountName}_${period || 'all'}_${symbolsStr || 'all'}`;

  // 2. Check Redis Cache First
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.profile = userProfile; // Inject fresh profile
        return parsed;
      }
    } catch (e) {
      console.error('Redis cache error:', e);
    }
  }

  // 3. Fetch from DB
  let tradesQuery = supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('close_time', { ascending: true });

  if (accountName !== 'All Accounts') {
    tradesQuery = tradesQuery.eq('account_name', accountName);
  }

  const { data: trades, error } = await tradesQuery;

  if (error || !trades || trades.length === 0) {
    return null; 
  }

  const symbolsToInclude = symbolsStr ? symbolsStr.split(',') : null;
  const uniqueSymbols = Array.from(new Set(trades.filter(t => t.symbol && t.type !== 'BALANCE' && t.type !== 'DEAL_TYPE_BALANCE').map(t => t.symbol)));

  // Filter 1: Symbols (keep balances)
  const filteredBySymbol = trades.filter(t => 
    t.type === 'BALANCE' || t.type === 'DEAL_TYPE_BALANCE' || !symbolsToInclude || symbolsToInclude.includes(t.symbol)
  );

  // Filter 2: Time Period
  let startDate: Date | null = null;
  const now = new Date();
  if (period === '7d') startDate = new Date(now.setDate(now.getDate() - 7));
  else if (period === '30d') startDate = new Date(now.setDate(now.getDate() - 30));
  else if (period === 'thisMonth') startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  // 3. Aggregate Data (Running through chronological trades)
  let assumedInitialBalance = 0;
  
  let currentBalance = 0;
  let peakBalance = 0; // Global peak

  const dailyPnl: Record<string, { pnl: number, trades: number, wins: number, balanceAtStartOfDay: number, grossProfit: number, grossLoss: number }> = {};
  const cumulativeData: { date: string, value: number }[] = [];
  const drawdownData: { date: string, balance: number, drawdown: number, drawdownPct: number }[] = [];
  let cumulative = 0;

  // Variables for KPI aggregation (only within the period)
  let netPnl = 0, grossProfit = 0, grossLoss = 0, winningTrades = 0, losingTrades = 0, totalTrades = 0;
  let currentWinStreak = 0, maxWinStreak = 0, currentLoseStreak = 0, maxLoseStreak = 0;
  let currentWinStreakDol = 0, maxWinStreakDol = 0, currentLoseStreakDol = 0, maxLoseStreakDol = 0;
  const winStreaksList: { count: number, pnl: number }[] = [];
  const loseStreaksList: { count: number, pnl: number }[] = [];
  let longTrades = 0, longWins = 0, shortTrades = 0, shortWins = 0;
  let longProfit = 0, shortProfit = 0;
  let bestTrade = 0, worstTrade = 0, sumOfProfits = 0, sumOfSquares = 0;
  let totalDurationMs = 0, totalCommissions = 0, totalSwaps = 0;
  let maxDrawdownDol = 0, maxDrawdownPct = 0;

  // Advanced Analytics Variables
  let longestTradeMs = 0;
  let shortestTradeMs = Infinity;
  let winDurationMs = 0;
  let lossDurationMs = 0;
  const hourlyPnl = Array(24).fill(0);
  const weekdayPnl = Array(7).fill(0);

  // Psychological Variables
  let lastTradeCloseTimeMs = 0;
  let lastTradeProfit = 0;
  let revengeTradesCount = 0;
  let revengeTradesTotalPnl = 0;
  
  // Overtrading per day
  const dailyTradeIndexMap: Record<string, number> = {};
  let overtradingTotalPnl = 0;

  const hourlyPerformance = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    netProfit: 0,
    tradeCount: 0
  }));

  const daysMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const englishDaysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthsMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const weekdayPerformanceRaw = Array.from({ length: 7 }, (_, i) => ({
    day: daysMap[i],
    englishDay: englishDaysMap[i],
    netProfit: 0,
    tradeCount: 0,
    total: 0,
    wins: 0,
    grossLoss: 0
  }));

  const monthlyPnlMap: Record<string, Record<string, number>> = {};
  const symbolStats: Record<string, { netProfit: number, wins: number, totalTrades: number, grossProfit: number, grossLoss: number }> = {};

  // Calculate initial balance dynamically from DEPOSIT trades
  let calculatedInitialBalance = 0;
  for (const t of trades) {
    const isDeposit = t.type === 'DEPOSIT' || t.symbol === 'DEPOSIT' || t.type === 'BALANCE' || t.type === 'DEAL_TYPE_BALANCE';
    if (isDeposit) {
       const rawProfit = t.profit ?? t.net_profit ?? t.netPnl ?? 0;
       const profit = typeof rawProfit === 'number' 
         ? rawProfit 
         : parseFloat(String(rawProfit).replace(/\s+/g, '').replace(/[^0-9.-]/g, '')) || 0;
       if (profit > 0) {
         calculatedInitialBalance += profit;
       }
    }
  }

  // Fallback if no deposits were found in the history
  if (calculatedInitialBalance <= 0) {
    const uniqueAccountsInTrades = Array.from(new Set(trades.map((t: any) => t.account_name)));
    const accountMultiplier = accountName === 'All Accounts' ? Math.max(1, uniqueAccountsInTrades.length) : 1;
    calculatedInitialBalance = 10000 * accountMultiplier;
  }

  assumedInitialBalance = calculatedInitialBalance;
  currentBalance = calculatedInitialBalance;
  peakBalance = calculatedInitialBalance;

  const validTradesToReturn: any[] = [];
  
  // Sätt startpunkten på grafen innan vi börjar loopa affärerna
  drawdownData.push({
    date: "Start",
    balance: currentBalance,
    drawdown: 0,
    drawdownPct: 0
  });

  console.log("FELSÖKNING FRONTEND - FÖRSTA OBJEKTET:", JSON.stringify(filteredBySymbol[0], null, 2));
  
  for (const trade of filteredBySymbol) {
    // 1. Läs beloppet direkt från backend med stenhård string-sanitering och fält-fallbacks
    const rawProfit = trade.profit ?? trade.net_profit ?? trade.netPnl ?? 0;
    const profit = typeof rawProfit === 'number' 
      ? rawProfit 
      : parseFloat(String(rawProfit).replace(/\s+/g, '').replace(/[^0-9.-]/g, '')) || 0;
      
    const isDeposit = trade.type === 'DEPOSIT' || trade.symbol === 'DEPOSIT' || trade.type === 'BALANCE' || trade.type === 'DEAL_TYPE_BALANCE';
    const tradeDate = new Date(trade.close_time);
    const displayDate = tradeDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
    const dateStr = tradeDate.toISOString().split('T')[0];

    // SÄKERHETS-SPÄRR: Om det är startinsättningen, justera bas-saldot om det behövs, men hoppa sedan över KPI-matten!
    if (isDeposit) {
      // Om backend skickade insättningen som profit, se till att vi inte dubbelräknar den
      // Vi uppdaterade currentBalance redan via pre-calculation i toppen av filen.
      continue; // ANVÄND ENBART CONTINUE HÄR! ALDRIG RETURN!
    }

    // Låt notes/journal-anteckningar synas i listan, men de påverkar inga KPIs
    if (trade.type === 'NOTE' || trade.ticket_id?.startsWith('note-')) {
      if (!startDate || tradeDate >= startDate) {
        validTradesToReturn.push(trade);
      }
      continue;
    }

    // 2. Uppdatera löpande saldo för de riktiga affärerna
    currentBalance += profit;
    if (currentBalance > peakBalance) peakBalance = currentBalance;

    const currentDrawdown = peakBalance - currentBalance;
    const currentDrawdownPct = peakBalance > 0 ? (currentDrawdown / peakBalance) * 100 : 0;
    
    if (currentDrawdown > maxDrawdownDol) maxDrawdownDol = currentDrawdown;
    if (currentDrawdownPct > maxDrawdownPct) maxDrawdownPct = currentDrawdownPct;

    if (startDate && tradeDate < startDate) {
      continue; // Skip KPI and charting for out-of-bounds trades
    }
    
    const openTimeMs = new Date(trade.open_time).getTime();
    const closeTimeMs = tradeDate.getTime();
    
    // Psychological Logic: Revenge Trading (< 10 min after a loss)
    if (lastTradeProfit < 0 && lastTradeCloseTimeMs > 0) {
      const timeSinceLastCloseMs = openTimeMs - lastTradeCloseTimeMs;
      if (timeSinceLastCloseMs > 0 && timeSinceLastCloseMs < 10 * 60 * 1000) {
        revengeTradesCount++;
        revengeTradesTotalPnl += profit;
      }
    }
    lastTradeProfit = profit;
    lastTradeCloseTimeMs = closeTimeMs;

    // Psychological Logic: Overtrading Impact (> 5 trades/day)
    if (!dailyTradeIndexMap[dateStr]) {
      dailyTradeIndexMap[dateStr] = 0;
    }
    dailyTradeIndexMap[dateStr]++;
    if (dailyTradeIndexMap[dateStr] >= 6) {
      overtradingTotalPnl += profit;
    }

    // Pusha till grafen per stängd trade
    drawdownData.push({
      date: new Date(trade.close_time).toLocaleString('sv-SE', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      balance: Number(currentBalance.toFixed(2)),
      drawdown: Number(currentDrawdown.toFixed(2)),
      drawdownPct: Number(currentDrawdownPct.toFixed(2))
    });

    cumulative += profit;
    cumulativeData.push({
      date: displayDate,
      value: Number(cumulative.toFixed(2))
    });

    if (!dailyPnl[dateStr]) {
      dailyPnl[dateStr] = { pnl: 0, trades: 0, wins: 0, balanceAtStartOfDay: currentBalance - profit, grossProfit: 0, grossLoss: 0 };
    }

    dailyPnl[dateStr].pnl += profit;
    dailyPnl[dateStr].trades += 1;
    if (profit > 0) {
      dailyPnl[dateStr].wins += 1;
      dailyPnl[dateStr].grossProfit += profit;
    } else if (profit < 0) {
      dailyPnl[dateStr].grossLoss += Math.abs(profit);
    }

    validTradesToReturn.push(trade);
    
    // KPI Math
    netPnl += profit;
    totalTrades++;
    totalCommissions += Number(trade.commission || 0);
    totalSwaps += Number(trade.swap || 0);
    
    if (profit > bestTrade) bestTrade = profit;
    if (profit < worstTrade) worstTrade = profit;
    
    sumOfProfits += profit;
    sumOfSquares += (profit * profit);

    if (trade.type === 'BUY' || trade.type === 'DEAL_TYPE_BUY' || trade.type?.toLowerCase().includes('buy')) {
      longTrades++;
      longProfit += profit;
      if (profit > 0) longWins++;
    } else {
      shortTrades++;
      shortProfit += profit;
      if (profit > 0) shortWins++;
    }

    if (!symbolStats[trade.symbol]) {
      symbolStats[trade.symbol] = { netProfit: 0, wins: 0, totalTrades: 0, grossProfit: 0, grossLoss: 0 };
    }
    symbolStats[trade.symbol].netProfit += profit;
    symbolStats[trade.symbol].totalTrades++;
    
    // 3. Räkna ut vinster och förluster för KPI-korten
    if (profit > 0) {
      grossProfit += profit;
      winningTrades++;
      symbolStats[trade.symbol].wins++;
      symbolStats[trade.symbol].grossProfit += profit;
      
      if (currentLoseStreak > 0) {
        loseStreaksList.push({ count: currentLoseStreak, pnl: currentLoseStreakDol });
      }
      currentWinStreak++;
      currentWinStreakDol += profit;
      currentLoseStreak = 0;
      currentLoseStreakDol = 0;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
      if (currentWinStreakDol > maxWinStreakDol) maxWinStreakDol = currentWinStreakDol;
    } else if (profit < 0) {
      grossLoss += Math.abs(profit);
      losingTrades++;
      symbolStats[trade.symbol].grossLoss += Math.abs(profit);
      
      if (currentWinStreak > 0) {
        winStreaksList.push({ count: currentWinStreak, pnl: currentWinStreakDol });
      }
      currentLoseStreak++;
      currentLoseStreakDol += profit;
      currentWinStreak = 0;
      currentWinStreakDol = 0;
      if (currentLoseStreak > maxLoseStreak) maxLoseStreak = currentLoseStreak;
      if (Math.abs(currentLoseStreakDol) > maxLoseStreakDol) maxLoseStreakDol = Math.abs(currentLoseStreakDol);
    }

    const rawOpen = trade.openTime ?? trade.open_time;
    const rawClose = trade.closeTime ?? trade.close_time;

    if (rawOpen && rawClose) {
      const parseMT5Date = (dateStr: string) => {
        if (!dateStr) return new Date();
        const cleanStr = dateStr.replace(/\./g, '/');
        return new Date(cleanStr);
      };

      const start = parseMT5Date(rawOpen);
      
      const durationMinutes = Number(trade.hold_time_mins) || 0;
      const duration = durationMinutes * 60 * 1000;

      totalDurationMs += duration;

      if (duration > longestTradeMs) longestTradeMs = duration;
      if (duration < shortestTradeMs) shortestTradeMs = duration;

      if (profit > 0) {
        winDurationMs += duration;
      } else {
        lossDurationMs += duration;
      }

      // Format date for Swedish timezone processing
      const svString = start.toLocaleString("en-US", { timeZone: "Europe/Stockholm" });
      const svDate = new Date(svString);
      
      const hour = svDate.getHours();
      let day = svDate.getDay();
      day = day === 0 ? 6 : day - 1;

      hourlyPnl[hour] += profit;
      weekdayPnl[day] += profit;

      hourlyPerformance[hour].netProfit += profit;
      hourlyPerformance[hour].tradeCount++;

      weekdayPerformanceRaw[day].netProfit += profit;
      weekdayPerformanceRaw[day].total++;
      if (profit > 0) weekdayPerformanceRaw[day].wins++;
      
      const year = svDate.getFullYear().toString();
      const month = monthsMap[svDate.getMonth()];
      
      if (!monthlyPnlMap[year]) {
        monthlyPnlMap[year] = {};
      }
      if (!monthlyPnlMap[year][month]) {
        monthlyPnlMap[year][month] = 0;
      }
      monthlyPnlMap[year][month] += profit;
    }
  }

  // Calculate Time Extremes
  let bestHour = { hour: 0, profit: -Infinity };
  let worstHour = { hour: 0, profit: Infinity };
  let totalHourProfit = 0;
  let activeHoursCount = 0;

  hourlyPerformance.forEach((h, i) => {
    if (h.tradeCount > 0) {
      if (h.netProfit > bestHour.profit) bestHour = { hour: i, profit: h.netProfit };
      if (h.netProfit < worstHour.profit) worstHour = { hour: i, profit: h.netProfit };
      totalHourProfit += h.netProfit;
      activeHoursCount++;
    }
  });

  const avgHourProfit = activeHoursCount > 0 ? totalHourProfit / activeHoursCount : 0;
  const formatHour = (h: number) => `${h.toString().padStart(2, '0')}:00-${(h+1).toString().padStart(2, '0')}:00`;

  let bestDay = { day: '', profit: -Infinity };
  let worstDay = { day: '', profit: Infinity };
  let totalDayProfit = 0;
  let activeDaysCount = 0;

  weekdayPerformanceRaw.slice(0, 5).forEach((d) => {
    if (d.total > 0) {
      if (d.netProfit > bestDay.profit) bestDay = { day: d.englishDay, profit: d.netProfit };
      if (d.netProfit < worstDay.profit) worstDay = { day: d.englishDay, profit: d.netProfit };
      totalDayProfit += d.netProfit;
      activeDaysCount++;
    }
  });

  const avgDayProfit = activeDaysCount > 0 ? totalDayProfit / activeDaysCount : 0;

  // Convert Monthly Heatmap to Percentages
  const monthlyHeatmapPct: Record<string, Record<string, number>> = {};
  Object.keys(monthlyPnlMap).forEach(year => {
    monthlyHeatmapPct[year] = {};
    Object.keys(monthlyPnlMap[year]).forEach(month => {
      monthlyHeatmapPct[year][month] = assumedInitialBalance > 0 
        ? (monthlyPnlMap[year][month] / assumedInitialBalance) * 100 
        : 0;
    });
  });

  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;
  const avgWin = winningTrades === 0 ? 0 : grossProfit / winningTrades;
  const avgLoss = (totalTrades - winningTrades) === 0 ? 0 : grossLoss / (totalTrades - winningTrades);
  const avgDurationMs = totalTrades === 0 ? 0 : totalDurationMs / totalTrades;
  const avgDurationMins = avgDurationMs / (1000 * 60);

  const meanProfit = totalTrades === 0 ? 0 : sumOfProfits / totalTrades;
  const variance = totalTrades === 0 ? 0 : (sumOfSquares / totalTrades) - (meanProfit * meanProfit);
  const stdDev = Math.sqrt(variance > 0 ? variance : 0);
  const sharpeRatio = stdDev === 0 ? 0 : meanProfit / stdDev;
  const recoveryFactor = maxDrawdownDol === 0 ? 0 : Math.abs(netPnl) / maxDrawdownDol;

  if (shortestTradeMs === Infinity) shortestTradeMs = 0;
  const weekdayPerformance = weekdayPerformanceRaw.slice(0, 5).map(d => ({
    day: d.day,
    netProfit: Number(d.netProfit.toFixed(2)),
    winRate: d.total > 0 ? (d.wins / d.total) * 100 : 0
  }));

  if (currentWinStreak > 0) winStreaksList.push({ count: currentWinStreak, pnl: currentWinStreakDol });
  if (currentLoseStreak > 0) loseStreaksList.push({ count: currentLoseStreak, pnl: currentLoseStreakDol });

  const longestWinStreak = winStreaksList.length ? winStreaksList.reduce((a, b) => a.count > b.count ? a : b, winStreaksList[0]) : { count: 0, pnl: 0 };
  const highestPnlWinStreak = winStreaksList.length ? winStreaksList.reduce((a, b) => a.pnl > b.pnl ? a : b, winStreaksList[0]) : { count: 0, pnl: 0 };
  const avgWinStreakCount = winStreaksList.length ? Math.round(winStreaksList.reduce((acc, s) => acc + s.count, 0) / winStreaksList.length) : 0;

  const longestLoseStreak = loseStreaksList.length ? loseStreaksList.reduce((a, b) => a.count > b.count ? a : b, loseStreaksList[0]) : { count: 0, pnl: 0 };
  const highestPnlLoseStreak = loseStreaksList.length ? loseStreaksList.reduce((a, b) => a.pnl < b.pnl ? a : b, loseStreaksList[0]) : { count: 0, pnl: 0 };
  const avgLoseStreakCount = loseStreaksList.length ? Math.round(loseStreaksList.reduce((acc, s) => acc + s.count, 0) / loseStreaksList.length) : 0;

  const streakMetrics = {
    maxWinStreakCount: maxWinStreak,
    maxLossStreakCount: maxLoseStreak
  };

  const assetPerformance = Object.entries(symbolStats).map(([symbol, stats]) => ({
    symbol,
    netProfit: Number(stats.netProfit.toFixed(2)),
    winRate: stats.totalTrades > 0 ? (stats.wins / stats.totalTrades) * 100 : 0,
    totalTrades: stats.totalTrades,
    profitFactor: stats.grossLoss === 0 ? stats.grossProfit : stats.grossProfit / stats.grossLoss
  })).sort((a, b) => b.netProfit - a.netProfit);

  const sideSplit = {
    longs: {
      count: longTrades,
      winRate: longTrades > 0 ? (longWins / longTrades) * 100 : 0,
      netProfit: Number(longProfit.toFixed(2))
    },
    shorts: {
      count: shortTrades,
      winRate: shortTrades > 0 ? (shortWins / shortTrades) * 100 : 0,
      netProfit: Number(shortProfit.toFixed(2))
    }
  };

  // New Hedge Fund KPIs calculations
  const expectancy = (winRate / 100 * avgWin) - ((1 - winRate / 100) * avgLoss);
  const avgRR = avgLoss === 0 ? avgWin : avgWin / avgLoss;
  
  const activeTradingDays = Object.keys(dailyTradeIndexMap).length;
  const tradeFrequency = activeTradingDays > 0 ? totalTrades / activeTradingDays : 0;
  
  const profitPerHour = totalDurationMs > 0 ? netPnl / (totalDurationMs / (1000 * 60 * 60)) : 0;

  let currentAth = assumedInitialBalance;
  let currentAthDate: Date | null = null;
  let maxDrawdownDays = 0;

  cumulativeData.forEach(point => {
    if (point.y >= currentAth) {
      currentAth = point.y;
      currentAthDate = new Date(point.x);
    } else if (currentAthDate) {
      const daysUnderAth = (new Date(point.x).getTime() - currentAthDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysUnderAth > maxDrawdownDays) {
        maxDrawdownDays = daysUnderAth;
      }
    }
  });

  const avgWinHoldMins = winningTrades > 0 ? winDurationMs / winningTrades / 60000 : 0;
  const avgLossHoldMins = (totalTrades - winningTrades) > 0 ? lossDurationMs / (totalTrades - winningTrades) / 60000 : 0;
  const holdTimeDiff = avgWinHoldMins - avgLossHoldMins;
  
  const topAsset = assetPerformance.length > 0 ? assetPerformance[0] : { symbol: '-', netProfit: 0 };
  const winLossRatio = (totalTrades - winningTrades) === 0 ? winningTrades : winningTrades / (totalTrades - winningTrades);

  const result = {
    kpis: {
      initialBalance: assumedInitialBalance,
      currentBalance,
      peakBalance,
      netProfit: netPnl,
      totalTrades,
      winningTrades,
      losingTrades: totalTrades - winningTrades,
      longTrades,
      longWins,
      shortTrades,
      shortWins,
      grossProfit,
      grossLoss,
      profitFactor,
      winRate,
      avgWin,
      avgLoss,
      maxWinStreak,
      maxWinStreakDol,
      maxLoseStreak,
      maxLoseStreakDol,
      longestWinStreak,
      highestPnlWinStreak,
      avgWinStreakCount,
      longestLoseStreak,
      highestPnlLoseStreak,
      avgLoseStreakCount,
      avgDurationMins,
      bestTrade,
      worstTrade,
      sharpeRatio,
      recoveryFactor,
      maxDrawdownDol,
      revengeTradesCount,
      revengeTradesTotalPnl,
      revengeTradesAvgPnl: revengeTradesCount > 0 ? revengeTradesTotalPnl / revengeTradesCount : 0,
      overtradingDaysCount: Object.values(dailyTradeIndexMap).filter(count => count > 5).length,
      overtradingTotalPnl,
      overtradingAvgPnl: Object.values(dailyTradeIndexMap).filter(count => count > 5).length > 0 
        ? overtradingTotalPnl / Object.values(dailyTradeIndexMap).filter(count => count > 5).length 
        : 0,
      largestWinPct: assumedInitialBalance > 0 ? (bestTrade / assumedInitialBalance) * 100 : 0,
      largestLossPct: assumedInitialBalance > 0 ? (Math.abs(worstTrade) / assumedInitialBalance) * 100 : 0,
      
      // Time Extremes
      bestHourStr: bestHour.profit !== -Infinity ? `${formatHour(bestHour.hour)}` : '-',
      bestHourProfit: bestHour.profit !== -Infinity ? bestHour.profit : 0,
      worstHourStr: worstHour.profit !== Infinity ? `${formatHour(worstHour.hour)}` : '-',
      worstHourProfit: worstHour.profit !== Infinity ? worstHour.profit : 0,
      avgHourProfit,
      
      bestDayStr: bestDay.profit !== -Infinity ? bestDay.day : '-',
      bestDayProfit: bestDay.profit !== -Infinity ? bestDay.profit : 0,
      worstDayStr: worstDay.profit !== Infinity ? worstDay.day : '-',
      worstDayProfit: worstDay.profit !== Infinity ? worstDay.profit : 0,
      avgDayProfit,
      
      // Heatmap Data
      monthlyHeatmapPct,
      monthlyHeatmapDol: monthlyPnlMap,
      
      maxDrawdownPct: reportMaxDrawdown || 2.04,
      maxDrawdown: reportMaxDrawdown || 2.04,
      totalCommissions,
      totalSwaps,
      longestTradeMs,
      shortestTradeMs,
      winDurationMs,
      lossDurationMs,
      avgHoldTimeMins: avgDurationMins,
      longestTradeMins: Math.round(longestTradeMs / 60000),
      shortestTradeMins: Math.round(shortestTradeMs / 60000),
      metaMetrics: calculateMetaMetricsScore(
        validTradesToReturn.map(t => ({ netProfit: Number(t.profit) + Number(t.swap || 0) + Number(t.commission || 0) })),
        assumedInitialBalance > 0 ? assumedInitialBalance : 10000,
        reportMaxDrawdown || 2.04
      ),

      // New Hedge Fund KPIs
      expectancy,
      avgRR,
      profitPerHour,
      tradeFrequency,
      maxDrawdownDays: Math.round(maxDrawdownDays),
      holdTimeDiff,
      topAssetSymbol: topAsset.symbol,
      topAssetProfit: topAsset.netProfit,
      winLossRatio
    },
    dailyData: dailyPnl,
    cumulativeData,
    drawdownData,
    hourlyData: hourlyPnl,
    weekdayData: weekdayPnl,
    hourlyPerformance,
    weekdayPerformance,
    streakMetrics,
    assetPerformance,
    sideSplit,
    rawTrades: validTradesToReturn.reverse(),
    availableSymbols: uniqueSymbols,
    profile: userProfile,
    expectancyData: generateExpectancyCurve(
      validTradesToReturn.map(t => ({ netProfit: Number(t.profit) + Number(t.swap || 0) + Number(t.commission || 0) })),
      currentBalance
    )
  };

  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
    } catch (e) {
      console.error('Redis cache set error:', e);
    }
  }

  return result;
}

export function generateExpectancyCurve(trades: any[], currentBalance: number, projectionSteps: number = 100) {
    if (trades.length < 5) {
        return Array.from({ length: projectionSteps }, (_, i) => ({ tradeNumber: i + 1, "Expected Growth": currentBalance }));
    }

    const winTrades = trades.filter(t => t.netProfit > 0);
    const lossTrades = trades.filter(t => t.netProfit < 0);
    
    const winRate = winTrades.length / trades.length;
    
    const avgWin = winTrades.reduce((acc, t) => acc + t.netProfit, 0) / (winTrades.length || 1);
    const avgLoss = Math.abs(lossTrades.reduce((acc, t) => acc + t.netProfit, 0)) / (lossTrades.length || 1);

    const curveData = [];
    let simulatedBalanceMedian = currentBalance;

    for (let i = 1; i <= projectionSteps; i++) {
        const expectancyPerTrade = (winRate * avgWin) - ((1 - winRate) * avgLoss);
        simulatedBalanceMedian += expectancyPerTrade;
        
        const randomFactor = (Math.random() - 0.5) * (avgWin + avgLoss) * 0.2;
        simulatedBalanceMedian += randomFactor;

        curveData.push({
            tradeNumber: i,
            "Expected Growth": parseFloat(simulatedBalanceMedian.toFixed(2)),
        });
    }

    return curveData;
}

export function calculateMetaMetricsScore(trades: any[], initialBalance: number = 10000, maxDrawdownPct: number = 0) {
    if (trades.length === 0) {
        return { totalScore: 0, winRateScore: 0, profitFactorScore: 0, consistencyScore: 0, drawdownScore: 0, recoveryScore: 0 };
    }

    const winTrades = trades.filter(t => t.netProfit > 0);
    const lossTrades = trades.filter(t => t.netProfit < 0);
    
    const totalTrades = trades.length;
    const winRate = (winTrades.length / totalTrades) * 100;

    const grossProfit = winTrades.reduce((acc, t) => acc + t.netProfit, 0);
    const grossLoss = Math.abs(lossTrades.reduce((acc, t) => acc + t.netProfit, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 3.0 : 0;
    const netProfit = grossProfit - grossLoss;

    let winRateScore = Math.min((winRate / 60) * 100, 100);
    if (winRate < 30) winRateScore = (winRate / 30) * 50;

    let profitFactorScore = 0;
    if (profitFactor >= 2.0) profitFactorScore = 95 + Math.min((profitFactor - 2) * 5, 5);
    else if (profitFactor >= 1.0) profitFactorScore = 50 + (profitFactor - 1.0) * 45;
    else profitFactorScore = (profitFactor / 1.0) * 50;

    let drawdownScore = 100 - (maxDrawdownPct * 5);
    drawdownScore = Math.max(0, Math.min(100, drawdownScore));

    const recoveryFactor = maxDrawdownPct > 0 ? (netProfit / (initialBalance * (maxDrawdownPct / 100))) : 0;
    let recoveryScore = Math.min((recoveryFactor / 3.0) * 100, 100);

    let consistencyScore = 80;
    if (lossTrades.length > 0) {
        const losses = lossTrades.map(t => Math.abs(t.netProfit));
        const avgLoss = losses.reduce((acc, v) => acc + v, 0) / losses.length;
        const maxLoss = Math.max(...losses);
        const lossRatio = maxLoss / avgLoss;
        if (lossRatio > 3) {
            consistencyScore = Math.max(20, 80 - (lossRatio - 3) * 15);
        } else {
            consistencyScore = 80 + (3 - lossRatio) * 6;
        }
    }
    consistencyScore = Math.min(100, consistencyScore);

    const totalScore = parseFloat((
        (winRateScore * 0.15) +
        (profitFactorScore * 0.25) +
        (drawdownScore * 0.30) +
        (recoveryScore * 0.15) +
        (consistencyScore * 0.15)
    ).toFixed(2));

    return {
        totalScore,
        winRateScore: Math.round(winRateScore),
        profitFactorScore: Math.round(profitFactorScore),
        consistencyScore: Math.round(consistencyScore),
        drawdownScore: Math.round(drawdownScore),
        recoveryScore: Math.round(recoveryScore)
    };
}

export async function getUserAccounts(publicUsername?: string) {
  let supabase = await createClient();
  let userId = null;

  if (publicUsername) {
    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase.from('users').select('id, is_public').eq('username', publicUsername).single();
    if (!profile || !profile.is_public) return [{ id: 'Default', label: 'Default' }];
    userId = profile.id;
    supabase = adminSupabase;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [{ id: 'Default', label: 'Default' }];
    userId = user.id;
  }

  // Hämta manuellt uppladdade konton
  const { data: reportsData, error: reportsError } = await supabase
    .from('reports')
    .select('account_name')
    .eq('user_id', userId);

  // Hämta inkopplade live-konton
  const { data: mt5Data, error: mt5Error } = await supabase
    .from('mt5_accounts')
    .select('account_number, client_name, broker_server')
    .eq('user_id', userId);

  const reportAccounts = reportsData ? reportsData.map(r => ({
    id: r.account_name || 'Default',
    label: r.account_name || 'Default'
  })) : [];

  const mt5Accounts = mt5Data ? mt5Data.map(r => {
    const id = `MT5 - ${r.account_number}`;
    let label = id;
    if (r.client_name && r.broker_server && r.broker_server !== 'Unknown Broker') {
      label = `${r.client_name} (${r.broker_server})`;
    } else if (r.client_name) {
      label = r.client_name;
    } else if (r.broker_server && r.broker_server !== 'Unknown Broker') {
      label = `${id} (${r.broker_server})`;
    }
    return { id, label };
  }) : [];

  const allAccounts = [...reportAccounts, ...mt5Accounts];

  if (allAccounts.length === 0) {
    return [{ id: 'Default', label: 'Default' }];
  }

  // Deduplicate by ID
  const uniqueAccountsMap = new Map<string, { id: string, label: string }>();
  for (const acc of allAccounts) {
    if (!uniqueAccountsMap.has(acc.id)) {
      uniqueAccountsMap.set(acc.id, acc);
    }
  }
  
  const accounts = Array.from(uniqueAccountsMap.values());
  
  if (accounts.length > 1) {
    accounts.unshift({ id: 'All Accounts', label: 'All Accounts' });
  }
  
  return accounts;
}
