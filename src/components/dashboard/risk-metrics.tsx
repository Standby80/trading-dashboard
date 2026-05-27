import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export function RiskMetrics({ kpis }: { kpis: any }) {
  const t = useTranslations('Dashboard');
  if (!kpis) return null;

  const formatMoney = (val: number) => Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatPct = (val: number) => (val).toFixed(2) + '%';

  const MetricBar = ({ label, value, max, colorClass, minLabel, maxLabel }: any) => {
    const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{label}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-sm sm:text-base text-slate-200 mt-1 font-semibold">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-transparent border-none shadow-none h-full flex flex-col">
      <CardHeader className="pb-0 pt-2 px-5 shrink-0">
        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          {t('riskMetrics')}
          <Tooltip>
            <TooltipTrigger className="outline-none"><Info className="w-4 h-4 text-slate-500 cursor-pointer" /></TooltipTrigger>
            <TooltipContent className="bg-[#1e293b] text-white border-border w-64">
               <p><strong>Max Drawdown:</strong> The largest peak-to-trough decline in account value.<br/><strong>Sharpe Ratio:</strong> Measures risk-adjusted return.</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-2 mt-2">
          
          <MetricBar 
            label="Max. Drawdown (%)" 
            value={kpis.maxDrawdown ?? kpis.maxDrawdownPct ?? 0} 
            max={100} 
            colorClass="bg-rose-500" 
            minLabel="0%" 
            maxLabel={formatPct(kpis.maxDrawdown ?? kpis.maxDrawdownPct ?? 0)} 
          />
          
          <MetricBar 
            label={t('sharpeRatio')} 
            value={kpis.sharpeRatio} 
            max={5} 
            colorClass="bg-gradient-to-r from-amber-600 to-amber-400" 
            minLabel="0" 
            maxLabel={kpis.sharpeRatio.toFixed(2)} 
          />

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
               <span>{t('maxConsecutiveWins')}</span>
            </div>
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted">
               <div className="bg-emerald-500" style={{ width: `${(kpis.maxWinStreak / Math.max(1, kpis.maxWinStreak + kpis.maxLoseStreak)) * 100}%` }}></div>
               <div className="bg-rose-500" style={{ width: `${(kpis.maxLoseStreak / Math.max(1, kpis.maxWinStreak + kpis.maxLoseStreak)) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-sm sm:text-base text-slate-200 mt-1 font-semibold">
               <span className="text-emerald-500">{kpis.maxWinStreak}</span>
               <span className="text-rose-500">{kpis.maxLoseStreak}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
               <span>{t('maxConsecutiveProfit')}</span>
            </div>
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted">
               <div className="bg-emerald-500/70" style={{ width: `${(kpis.maxWinStreakDol / Math.max(1, kpis.maxWinStreakDol + kpis.maxLoseStreakDol)) * 100}%` }}></div>
               <div className="bg-rose-500/70" style={{ width: `${(kpis.maxLoseStreakDol / Math.max(1, kpis.maxWinStreakDol + kpis.maxLoseStreakDol)) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-sm sm:text-base text-slate-200 mt-1 font-semibold">
               <span className="text-emerald-500/80">${formatMoney(kpis.maxWinStreakDol)}</span>
               <span className="text-rose-500/80">-${formatMoney(kpis.maxLoseStreakDol)}</span>
            </div>
          </div>

          <MetricBar 
            label={t('avgHoldTime')} 
            value={kpis.avgDurationMins} 
            max={Math.max(kpis.avgDurationMins * 2, 60)} 
            colorClass="bg-indigo-500" 
            minLabel="0m" 
            maxLabel={`${Math.round(kpis.avgDurationMins)}m`} 
          />


        </div>
      </CardContent>
    </Card>
  );
}
