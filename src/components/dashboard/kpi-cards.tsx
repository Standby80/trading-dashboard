import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// A simple mock sparkline SVG for the cards
const Sparkline = ({ color = "#10b981" }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
    <path d="M0,40 L0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,15 L70,5 L80,10 L90,2 L100,0 L100,40 Z" fill={`url(#gradient-${color.replace('#','')})`} opacity="0.2" />
    <path d="M0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,15 L70,5 L80,10 L90,2 L100,0" fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    <defs>
      <linearGradient id={`gradient-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="1"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

export function KPICards({ data }: { data?: any }) {
  const kpi = data || {
    netProfit: 0,
    profitFactor: 0,
    winRate: 0,
    expectancy: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalTrades: 0,
    avgWin: 0,
    avgLoss: 0
  };

  const totalNetProfit = typeof kpi.netProfit === 'number' 
    ? kpi.netProfit 
    : parseFloat(String(kpi.netProfit).replace(/\s+/g, '').replace(/[^0-9.-]/g, '')) || 0;

  const isProfit = totalNetProfit >= 0;
  
  // Total Win/Loss $
  const totalWinDol = kpi.winningTrades * (kpi.avgWin || 0);
  const totalLossDol = kpi.losingTrades * (kpi.avgLoss || 0);
  const totalWLDol = totalWinDol + totalLossDol;
  const winPct = totalWLDol > 0 ? (totalWinDol / totalWLDol) * 100 : 50;
  const lossPct = totalWLDol > 0 ? (totalLossDol / totalWLDol) * 100 : 50;

  // Real win rate
  const winRateVal = kpi.totalTrades > 0 ? (kpi.winningTrades / kpi.totalTrades) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
      {/* Net P&L */}
      <Card className="bg-[#131823] border-[#1e2330] rounded-xl shadow-none overflow-hidden relative flex flex-col justify-between">
        <CardContent className="p-4 flex flex-col h-full z-10">
          <span className="text-xs text-slate-400 mb-2 font-medium">Net P&L</span>
          <div className={`text-2xl font-bold ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
            ${Math.abs(totalNetProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-500 mt-1">+18.2% vs previous</span>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 z-0">
           <Sparkline color={isProfit ? "#10b981" : "#f43f5e"} />
        </div>
      </Card>

      {/* Profit Factor */}
      <Card className="bg-[#131823] border-[#1e2330] rounded-xl shadow-none overflow-hidden relative flex flex-col justify-between">
        <CardContent className="p-4 flex flex-col h-full z-10">
          <span className="text-xs text-slate-400 mb-2 font-medium">Profit Factor</span>
          <div className="text-2xl font-bold text-white">
            {kpi.profitFactor?.toFixed(2) || '0.00'}
          </div>
          <span className="text-[10px] text-emerald-500 mt-1">Good</span>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 z-0">
           <Sparkline color="#10b981" />
        </div>
      </Card>

      {/* Win Rate */}
      <Card className="bg-[#131823] border-[#1e2330] rounded-xl shadow-none overflow-hidden relative flex flex-col justify-between">
        <CardContent className="p-4 flex flex-col h-full z-10">
          <span className="text-xs text-slate-400 mb-2 font-medium">Win Rate</span>
          <div className="text-2xl font-bold text-white">
            {winRateVal.toFixed(2)}%
          </div>
          <span className="text-[10px] text-emerald-500 mt-1">+4.1% vs previous</span>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 z-0">
           <Sparkline color="#10b981" />
        </div>
      </Card>

      {/* Expectancy (R) */}
      <Card className="bg-[#131823] border-[#1e2330] rounded-xl shadow-none overflow-hidden relative flex flex-col justify-between">
        <CardContent className="p-4 flex flex-col h-full z-10">
          <span className="text-xs text-slate-400 mb-2 font-medium">Expectancy (R)</span>
          <div className="text-2xl font-bold text-white">
            {kpi.expectancy?.toFixed(2) || '0.00'}
          </div>
          <span className="text-[10px] text-emerald-500 mt-1">Strong</span>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 z-0">
           <Sparkline color="#10b981" />
        </div>
      </Card>

      {/* Wins vs Losses */}
      <Card className="bg-[#131823] border-[#1e2330] rounded-xl shadow-none overflow-hidden flex flex-col justify-between">
        <CardContent className="p-4 flex flex-col h-full justify-between">
          <span className="text-xs text-slate-400 font-medium">Wins vs Losses</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-xl font-bold text-emerald-500">{winRateVal.toFixed(0)}%</span>
            <span className="text-xl font-bold text-rose-500">{(100 - winRateVal).toFixed(0)}%</span>
          </div>
          <div className="w-full flex h-3 rounded-full overflow-hidden bg-[#1e2330] mt-1 mb-2">
            <div className="bg-emerald-500 h-full" style={{ width: `${winRateVal}%` }}></div>
            <div className="bg-rose-500 h-full" style={{ width: `${100 - winRateVal}%` }}></div>
          </div>
          <div className="flex justify-between mt-auto">
             <span className="text-[10px] text-slate-400"><span className="text-emerald-500">${totalWinDol.toLocaleString(undefined, {maximumFractionDigits:0})}</span> Wins</span>
             <span className="text-[10px] text-slate-400"><span className="text-rose-500">${totalLossDol.toLocaleString(undefined, {maximumFractionDigits:0})}</span> Losses</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
