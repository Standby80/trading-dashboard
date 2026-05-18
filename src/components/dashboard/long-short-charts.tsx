'use client'

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function LongShortCharts({ kpis }: { kpis: any }) {
  if (!kpis) return null;

  const longShortData = [
    { name: 'Long Trades', value: kpis.longTrades, color: '#3b82f6' }, // Blue
    { name: 'Short Trades', value: kpis.shortTrades, color: '#f97316' }, // Orange
  ];

  const typeData = [
    { name: 'Manual Trading', value: kpis.totalTrades, color: '#ffffff' }, // White
    { name: 'Algorithmic', value: 0, color: '#64748b' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a2130] border border-white/10 p-3 rounded-lg shadow-xl text-sm">
          <p className="font-semibold text-white mb-1">{payload[0].name}</p>
          <p className="text-slate-300">Count: {payload[0].value}</p>
          {payload[0].name === 'Long Trades' && (
            <p className="text-emerald-400 mt-1">Win Rate: {kpis.longTrades > 0 ? ((kpis.longWins / kpis.longTrades) * 100).toFixed(1) : 0}%</p>
          )}
          {payload[0].name === 'Short Trades' && (
            <p className="text-emerald-400 mt-1">Win Rate: {kpis.shortTrades > 0 ? ((kpis.shortWins / kpis.shortTrades) * 100).toFixed(1) : 0}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      
      {/* Long & Short Pie */}
      <Card className="bg-[#131823] border-white/5 rounded-xl p-5 shadow-none flex flex-col h-full">
        <h3 className="text-sm font-semibold text-white mb-2 shrink-0">Long & Short Split</h3>
        <div className="flex-1 h-full min-h-0 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={longShortData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                stroke="none"
                dataKey="value"
              >
                {longShortData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-2xl font-bold text-white">
                {kpis.totalTrades > 0 ? ((kpis.longTrades / kpis.totalTrades) * 100).toFixed(2) : 0}%
             </span>
             <span className="text-xs text-slate-400">Long Trades</span>
          </div>
        </div>
      </Card>

      {/* Manual vs Algo Pie */}
      <Card className="bg-[#131823] border-white/5 rounded-xl p-5 shadow-none flex flex-col h-full">
        <h3 className="text-sm font-semibold text-white mb-2 shrink-0">Trading Type</h3>
        <div className="flex-1 h-full min-h-0 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                stroke="none"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a2130', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} 
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-2xl font-bold text-white">{kpis.totalTrades}</span>
             <span className="text-xs text-slate-400">Manual Trading</span>
          </div>
        </div>
      </Card>

    </div>
  );
}
