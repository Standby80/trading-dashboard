import { Card } from "@/components/ui/card";

export function AdvancedMetrics({ kpis }: { kpis: any }) {
  if (!kpis) return null;

  const formatMoney = (val: number) => Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatPct = (val: number) => (val).toFixed(2) + '%';

  const MetricBar = ({ label, value, max, colorClass, minLabel, maxLabel }: any) => {
    const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{label}</span>
        </div>
        <div className="h-2 bg-[#1a2130] rounded-full overflow-hidden flex">
          <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-[#131823] border-white/5 rounded-xl p-6 shadow-none">
      <h3 className="text-sm font-semibold text-white mb-6">Advanced P&L</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Gross Profit / Loss */}
        <div className="flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-xs font-medium text-slate-300">Gross Profit</span>
             </div>
             <span className="text-xl font-semibold text-emerald-400">+{formatMoney(kpis.grossProfit)}</span>
           </div>
           
           <div className="mt-6">
             <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-rose-500"></div>
               <span className="text-xs font-medium text-slate-300">Gross Loss</span>
             </div>
             <span className="text-xl font-semibold text-rose-400">-{formatMoney(kpis.grossLoss)}</span>
           </div>

           <div className="flex justify-between mt-6 pt-4 border-t border-white/5 text-xs text-slate-400">
             <div className="flex flex-col">
                <span>{kpis.totalSwaps < 0 ? '-' : '+'}{formatMoney(kpis.totalSwaps)}</span>
                <span className="text-[10px] uppercase tracking-wider">Swaps</span>
             </div>
             <div className="flex flex-col text-right">
                <span>-{formatMoney(kpis.totalCommissions)}</span>
                <span className="text-[10px] uppercase tracking-wider">Commissions</span>
             </div>
           </div>
        </div>

        {/* Factors */}
        <div>
          <MetricBar 
            label="Sharpe Ratio" 
            value={kpis.sharpeRatio} 
            max={5} 
            colorClass="bg-gradient-to-r from-amber-600 to-amber-400" 
            minLabel="0" 
            maxLabel={kpis.sharpeRatio.toFixed(2)} 
          />
          <MetricBar 
            label="Profit Factor" 
            value={kpis.profitFactor} 
            max={4} 
            colorClass="bg-gradient-to-r from-emerald-600 to-emerald-400" 
            minLabel="0" 
            maxLabel={kpis.profitFactor.toFixed(2)} 
          />
          <MetricBar 
            label="Recovery Factor" 
            value={kpis.recoveryFactor} 
            max={10} 
            colorClass="bg-gradient-to-r from-indigo-600 to-indigo-400" 
            minLabel="0" 
            maxLabel={kpis.recoveryFactor.toFixed(2)} 
          />
        </div>

        {/* Drawdown & Trades */}
        <div>
          <MetricBar 
            label="Max. Drawdown ($)" 
            value={kpis.maxDrawdownDol} 
            max={kpis.maxDrawdownDol * 2 || 1000} 
            colorClass="bg-rose-500" 
            minLabel="$0" 
            maxLabel={"$" + formatMoney(kpis.maxDrawdownDol)} 
          />
          <MetricBar 
            label="Max. Drawdown (%)" 
            value={kpis.maxDrawdownPct} 
            max={100} 
            colorClass="bg-rose-500" 
            minLabel="0%" 
            maxLabel={formatPct(kpis.maxDrawdownPct)} 
          />
          <MetricBar 
            label="Trades per Week" 
            value={kpis.totalTrades > 0 ? kpis.totalTrades / 4 : 0} 
            max={20} 
            colorClass="bg-slate-400" 
            minLabel="0" 
            maxLabel={Math.round(kpis.totalTrades / 4)} 
          />
        </div>

        {/* Streaks */}
        <div className="space-y-4">
           <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                 <span>Max. consecutive wins / losses</span>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#1a2130]">
                 <div className="bg-emerald-500" style={{ width: `${(kpis.maxWinStreak / Math.max(1, kpis.maxWinStreak + kpis.maxLoseStreak)) * 100}%` }}></div>
                 <div className="bg-rose-500" style={{ width: `${(kpis.maxLoseStreak / Math.max(1, kpis.maxWinStreak + kpis.maxLoseStreak)) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                 <span className="text-emerald-500">{kpis.maxWinStreak}</span>
                 <span className="text-rose-500">{kpis.maxLoseStreak}</span>
              </div>
           </div>

           <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                 <span>Max. consecutive profit / loss ($)</span>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#1a2130]">
                 <div className="bg-emerald-500/70" style={{ width: `${(kpis.maxWinStreakDol / Math.max(1, kpis.maxWinStreakDol + kpis.maxLoseStreakDol)) * 100}%` }}></div>
                 <div className="bg-rose-500/70" style={{ width: `${(kpis.maxLoseStreakDol / Math.max(1, kpis.maxWinStreakDol + kpis.maxLoseStreakDol)) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                 <span className="text-emerald-500/80">${formatMoney(kpis.maxWinStreakDol)}</span>
                 <span className="text-rose-500/80">-${formatMoney(kpis.maxLoseStreakDol)}</span>
              </div>
           </div>
           
           <div className="pt-2 border-t border-white/5">
             <div className="flex justify-between text-xs font-medium">
               <span className="text-emerald-400">Best trade: +${formatMoney(kpis.bestTrade)}</span>
               <span className="text-rose-400">Worst trade: ${formatMoney(kpis.worstTrade)}</span>
             </div>
           </div>
        </div>

      </div>
    </Card>
  );
}
