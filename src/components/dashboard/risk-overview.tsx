'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RiskOverview({ kpis }: { kpis: any }) {
  if (!kpis) return null;

  const ddPct = ((kpis.maxDrawdownDol || 0) / (kpis.peakBalance || 1) * 100);
  const sharpe = kpis.sharpeRatio || 0;
  const pf = kpis.profitFactor || 0;
  const exp = kpis.expectancy || 0;
  const winRate = kpis.winRate || 0;
  const rrWin = kpis.avgWin || 0;
  const rrLoss = kpis.avgLoss || 0;

  // Normalized widths for the bars (max 100%)
  const ddWidth = Math.min(100, ddPct * 2); 
  const sharpeWidth = Math.min(100, sharpe * 20);
  const pfWidth = Math.min(100, pf * 30);
  const expWidth = Math.min(100, exp * 20);
  
  const rrTotal = rrWin + rrLoss;
  const rrWinWidth = rrTotal > 0 ? (rrWin / rrTotal) * 100 : 50;
  const rrLossWidth = rrTotal > 0 ? (rrLoss / rrTotal) * 100 : 50;

  return (
    <Card className="bg-transparent border-transparent rounded-xl shadow-none h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-white/5">
        <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Risk Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Max Drawdown */}
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 w-24">Max Drawdown</span>
            <div className="flex-1 mx-4 h-2 bg-[#1e2330] rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${ddWidth}%` }}></div>
            </div>
            <span className="text-xs font-medium text-white w-12 text-right">{ddPct.toFixed(2)}%</span>
        </div>

        {/* Sharpe Ratio */}
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 w-24">Sharpe Ratio</span>
            <div className="flex-1 mx-4 h-2 bg-[#1e2330] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sharpeWidth}%` }}></div>
            </div>
            <span className="text-xs font-medium text-white w-12 text-right">{sharpe.toFixed(2)}</span>
        </div>

        {/* Profit Factor */}
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 w-24">Profit Factor</span>
            <div className="flex-1 mx-4 h-2 bg-[#1e2330] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pfWidth}%` }}></div>
            </div>
            <span className="text-xs font-medium text-white w-12 text-right">{pf.toFixed(2)}</span>
        </div>

        {/* Expectancy */}
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 w-24">Expectancy (R)</span>
            <div className="flex-1 mx-4 h-2 bg-[#1e2330] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${expWidth}%` }}></div>
            </div>
            <span className="text-xs font-medium text-white w-12 text-right">{exp.toFixed(2)}</span>
        </div>

        {/* Win Rate */}
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 w-24">Win Rate</span>
            <div className="flex-1 mx-4 h-2 bg-[#1e2330] rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${winRate}%` }}></div>
            </div>
            <span className="text-xs font-medium text-white w-12 text-right">{winRate.toFixed(2)}%</span>
        </div>

        {/* Wins / Losses */}
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 w-24">Wins / Losses (R)</span>
            <div className="flex-1 mx-4 h-2 bg-rose-500 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${rrWinWidth}%` }}></div>
            </div>
            <span className="text-xs font-medium text-slate-400 w-16 text-right">
                <span className="text-emerald-500">{(rrWin/rrLoss).toFixed(2)}</span> / <span className="text-rose-500">-1.00</span>
            </span>
        </div>

      </CardContent>
    </Card>
  );
}
