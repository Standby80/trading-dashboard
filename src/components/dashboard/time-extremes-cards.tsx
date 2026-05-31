'use client';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export function TimeExtremesCards({ kpis }: { kpis: any }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Hour Extremes Card */}
      <div className="bg-transparent border-transparent rounded-xl p-4 flex justify-between items-center shadow-none">
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Best Hour</span>
          <div className="text-sm font-bold text-foreground">
            {kpis.bestHourStr} <span className="text-muted-foreground mx-1">•</span> <span className="text-emerald-400">{formatCurrency(kpis.bestHourProfit)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Worst</span>
          <div className="text-sm font-bold text-foreground">
            {kpis.worstHourStr} <span className="text-muted-foreground mx-1">•</span> <span className="text-rose-400">{formatCurrency(kpis.worstHourProfit)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg</span>
          <div className="text-sm font-bold text-foreground">
            {formatCurrency(kpis.avgHourProfit)}
          </div>
        </div>
      </div>

      {/* Day Extremes Card */}
      <div className="bg-transparent border-transparent rounded-xl p-4 flex justify-between items-center shadow-none">
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Best Day</span>
          <div className="text-sm font-bold text-foreground">
            {kpis.bestDayStr} <span className="text-muted-foreground mx-1">•</span> <span className="text-emerald-400">{formatCurrency(kpis.bestDayProfit)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Worst</span>
          <div className="text-sm font-bold text-foreground">
            {kpis.worstDayStr} <span className="text-muted-foreground mx-1">•</span> <span className="text-rose-400">{formatCurrency(kpis.worstDayProfit)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg</span>
          <div className="text-sm font-bold text-foreground">
            {formatCurrency(kpis.avgDayProfit)}
          </div>
        </div>
      </div>
    </div>
  );
}
