import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export function KPICards({ data }: { data?: any }) {
  const t = useTranslations('Dashboard');
  // Use mock data as fallback if no data provided
  const kpi = data || {
    netPnl: 7183.75,
    profitFactor: 2.17,
    winRate: 42.42,
    avgWin: 951,
    avgLoss: 322,
    winningTrades: 14,
    losingTrades: 19,
    totalTrades: 35
  };

  const totalNetProfit = typeof kpi.netProfit === 'number' 
    ? kpi.netProfit 
    : parseFloat(String(kpi.netProfit).replace(/\s+/g, '').replace(/[^0-9.-]/g, '')) || 0;

  const isProfit = totalNetProfit >= 0;
  
  // Calculate widths for the split bar
  const totalAvg = kpi.avgWin + kpi.avgLoss;
  const winWidth = totalAvg > 0 ? (kpi.avgWin / totalAvg) * 100 : 50;
  const lossWidth = totalAvg > 0 ? (kpi.avgLoss / totalAvg) * 100 : 50;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Net P&L */}
      <Card className="bg-transparent border-transparent shadow-none">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-center text-slate-400 text-sm mb-2 gap-1.5">
            {t('netPnl')}
            <Tooltip>
              <TooltipTrigger className="outline-none"><Info className="w-4 h-4 cursor-pointer" /></TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-white border-white/10"><p>{t('netPnlTooltip')}</p></TooltipContent>
            </Tooltip>
            <span className="ml-2 text-indigo-400 text-xs font-medium">{kpi.totalTrades}</span>
          </div>
          <div className={`text-3xl font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${Math.abs(totalNetProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      {/* Profit Factor */}
      <Card className="bg-transparent border-transparent shadow-none">
        <CardContent className="p-5 flex items-center justify-between h-full">
          <div>
            <div className="flex items-center text-slate-400 text-sm mb-2 gap-1.5">
              {t('profitFactorLabel')}
              <Tooltip>
                <TooltipTrigger className="outline-none"><Info className="w-4 h-4 cursor-pointer" /></TooltipTrigger>
                <TooltipContent className="bg-[#1e293b] text-white border-white/10"><p>{t('profitFactorTooltip')}</p></TooltipContent>
              </Tooltip>
            </div>
            <div className="text-3xl font-semibold text-white">
              {kpi.profitFactor.toFixed(2)}
            </div>
          </div>
          {/* Mock Circular Progress for now */}
          <div className="relative w-16 h-16 rounded-full border-4 border-rose-500 flex items-center justify-center">
             <div className="absolute inset-[-4px] rounded-full border-4 border-emerald-500 border-l-transparent border-b-transparent transform rotate-45"></div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Win % */}
      <Card className="bg-transparent border-transparent shadow-none">
        <CardContent className="p-5 flex items-center justify-between h-full">
          <div>
            <div className="flex items-center text-slate-400 text-sm mb-2 gap-1.5">
              {t('tradeWinPct')}
              <Tooltip>
                <TooltipTrigger className="outline-none"><Info className="w-4 h-4 cursor-pointer" /></TooltipTrigger>
                <TooltipContent className="bg-[#1e293b] text-white border-white/10"><p>{t('winRateTooltip')}</p></TooltipContent>
              </Tooltip>
            </div>
            <div className="text-3xl font-semibold text-white">
              {kpi.winRate.toFixed(2)}%
            </div>
          </div>
          {/* Mock Semi-Circle Gauge */}
          <div className="w-20 h-10 overflow-hidden relative flex flex-col items-center">
             <div className="w-20 h-20 border-[6px] border-rose-500 rounded-full border-t-emerald-500 border-r-indigo-500 transform -rotate-45"></div>
             <div className="absolute bottom-0 text-[10px] flex justify-between w-full px-2 text-slate-500 font-medium">
               <span className="text-emerald-500">{kpi.winningTrades}</span>
               <span className="text-rose-500">{kpi.losingTrades}</span>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Avg Win/Loss Trade */}
      <Card className="bg-transparent border-transparent shadow-none">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-center text-slate-400 text-sm mb-2 gap-1.5">
            {t('avgWinLossTrade')}
            <Tooltip>
              <TooltipTrigger className="outline-none"><Info className="w-4 h-4 cursor-pointer" /></TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-white border-white/10"><p>{t('avgWinLossTooltip')}</p></TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-end justify-between mb-2">
            <div className="text-3xl font-semibold text-white">
              {kpi.avgLoss === 0 ? kpi.avgWin.toFixed(2) : (kpi.avgWin / kpi.avgLoss).toFixed(2)}
            </div>
          </div>
          <div className="w-full flex h-2 rounded-full overflow-hidden bg-rose-500/20">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${winWidth}%` }}></div>
            <div className="bg-rose-500 h-full transition-all" style={{ width: `${lossWidth}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium">
             <span className="text-emerald-500">${kpi.avgWin.toFixed(0)}</span>
             <span className="text-rose-500">-${kpi.avgLoss.toFixed(0)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
