import { createClient } from './supabase/server';

export async function getDashboardData() {
  const supabase = await createClient();
  
  // Try to get user, fallback to dummy if local testing
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || '00000000-0000-0000-0000-000000000000';

  const { data: trades, error } = await supabase
    .from('trades')
    .select('*')
    // .eq('user_id', userId) // Commented out for MVP demo if you don't have auth forced
    .order('close_time', { ascending: true });

  if (error || !trades || trades.length === 0) {
    return null; // Return null to signify no data (show mock or empty state)
  }

  // Aggregate Data
  let netPnl = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let winningTrades = 0;
  let totalTrades = trades.length;

  // For calendar & area chart
  const dailyPnl: Record<string, { pnl: number, trades: number, wins: number }> = {};
  const cumulativeData: { date: string, value: number }[] = [];
  let cumulative = 0;

  trades.forEach(trade => {
    const profit = Number(trade.profit) + Number(trade.swap) + Number(trade.commission);
    netPnl += profit;

    if (profit > 0) {
      grossProfit += profit;
      winningTrades++;
    } else {
      grossLoss += Math.abs(profit);
    }

    // Group by day (YYYY-MM-DD)
    const dateObj = new Date(trade.close_time);
    const dateStr = dateObj.toISOString().split('T')[0];

    if (!dailyPnl[dateStr]) {
      dailyPnl[dateStr] = { pnl: 0, trades: 0, wins: 0 };
    }
    dailyPnl[dateStr].pnl += profit;
    dailyPnl[dateStr].trades += 1;
    if (profit > 0) dailyPnl[dateStr].wins += 1;

    // Cumulative P&L curve
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

  return {
    kpis: {
      netPnl,
      profitFactor,
      winRate,
      avgWin,
      avgLoss,
      winningTrades,
      losingTrades: totalTrades - winningTrades,
      totalTrades
    },
    dailyData: dailyPnl,
    cumulativeData
  };
}
