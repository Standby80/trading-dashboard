'use client'

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function LongShortCharts({ kpis }: { kpis: any }) {
  if (!kpis) return null;

  // Use the same neon indigo and purple as Directional Bias Analysis
  const longShortData = [
    { name: 'Longs', value: kpis.longTrades, color: '#6366f1' }, // Indigo
    { name: 'Shorts', value: kpis.shortTrades, color: '#a855f7' }, // Purple
  ];

  const longPct = kpis.totalTrades > 0 ? ((kpis.longTrades / kpis.totalTrades) * 100).toFixed(0) : 0;
  const shortPct = kpis.totalTrades > 0 ? ((kpis.shortTrades / kpis.totalTrades) * 100).toFixed(0) : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f131a] border border-border p-3 rounded-lg shadow-xl text-sm font-mono">
          <p className="font-semibold text-foreground mb-1">{payload[0].name}</p>
          <p className="text-muted-foreground">Total: {payload[0].value} trades</p>
          {payload[0].name === 'Longs' && (
            <p className="text-emerald-400 mt-1">Win Rate: {kpis.longTrades > 0 ? ((kpis.longWins / kpis.longTrades) * 100).toFixed(1) : 0}%</p>
          )}
          {payload[0].name === 'Shorts' && (
            <p className="text-emerald-400 mt-1">Win Rate: {kpis.shortTrades > 0 ? ((kpis.shortWins / kpis.shortTrades) * 100).toFixed(1) : 0}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <Card className="bg-transparent border-0 ring-0 rounded-xl shadow-none flex flex-col h-full p-5">
        <div className="shrink-0 mb-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Long & Short Split
          </h3>
          <p className="text-[11px] text-muted-foreground font-mono">Distribution and performance</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-between min-h-0 relative">
          {/* Chart Section */}
          <div className="w-full h-48 relative flex items-center justify-center shrink-0 mb-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={longShortData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  stroke="none"
                  dataKey="value"
                >
                  {longShortData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b0e14" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <div className="flex flex-col items-center leading-none font-mono">
                 <span className="text-lg font-bold text-indigo-400">{longPct}% <span className="text-[10px] text-muted-foreground font-normal">L</span></span>
                 <div className="w-8 h-px bg-white/10 my-1"></div>
                 <span className="text-lg font-bold text-purple-400">{shortPct}% <span className="text-[10px] text-muted-foreground font-normal">S</span></span>
               </div>
            </div>
          </div>

          {/* Stats Section matching the mono aesthetic */}
          <div className="w-full flex flex-col gap-3 justify-end mt-auto font-mono text-[11px]">
             
             <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground uppercase tracking-wider">Total Trades</span>
                <span className="text-sm font-bold text-foreground">{kpis.totalTrades}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mt-1">
               <div className="flex flex-col pl-2 border-l-2 border-indigo-500">
                  <span className="text-gray-500 uppercase tracking-wider mb-2">Longs ({kpis.longTrades})</span>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Wins</span>
                        <span className="text-emerald-400 font-bold">{kpis.longWins}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Losses</span>
                        <span className="text-rose-500 font-bold">{kpis.longTrades - kpis.longWins}</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex flex-col pl-2 border-l-2 border-purple-500">
                  <span className="text-gray-500 uppercase tracking-wider mb-2">Shorts ({kpis.shortTrades})</span>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Wins</span>
                        <span className="text-emerald-400 font-bold">{kpis.shortWins}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Losses</span>
                        <span className="text-rose-500 font-bold">{kpis.shortTrades - kpis.shortWins}</span>
                     </div>
                  </div>
               </div>
             </div>

          </div>
        </div>
      </Card>
    </div>
  );
}
