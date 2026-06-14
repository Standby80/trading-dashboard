'use client'

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Percent, DollarSign } from "lucide-react";

export function DrawdownChart({ data }: { data: any[] }) {
  const [displayMode, setDisplayMode] = useState<'$' | '%'>('%');

  if (!data || data.length === 0) return null;

  const currentDrawdownPct = data[data.length - 1]?.drawdownPct || 0;
  const currentDrawdown = data[data.length - 1]?.drawdown || 0;

  const formatMoney = (val: number) => Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <Card className="bg-transparent border-transparent rounded-xl p-6 shadow-none flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Drawdown</span>
        <div className="flex bg-background rounded p-1 border border-border">
          <button 
             onClick={() => setDisplayMode('$')}
             className={`flex items-center justify-center p-1 rounded transition-colors ${displayMode === '$' ? 'bg-muted text-rose-400' : 'text-muted-foreground hover:text-foreground'}`}
             title="Show Drawdown $"
          >
             <DollarSign className="w-3.5 h-3.5" />
          </button>
          <button 
             onClick={() => setDisplayMode('%')}
             className={`flex items-center justify-center p-1 rounded transition-colors ${displayMode === '%' ? 'bg-muted text-rose-400' : 'text-muted-foreground hover:text-foreground'}`}
             title="Show Drawdown %"
          >
             <Percent className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6 shrink-0">
         <div>
             <span className="text-xl font-bold text-foreground">
               {displayMode === '$' ? `$${formatMoney(currentDrawdown)}` : `${currentDrawdownPct.toFixed(2)}%`}
             </span>
             <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-rose-500"></div>
               <span className="text-xs text-muted-foreground">Current Drawdown</span>
             </div>
         </div>
      </div>

      <div className="flex-1 w-full min-h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.1)" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickMargin={10}
              minTickGap={30}
            />
            
            <YAxis 
              yAxisId="right"
              stroke="rgba(255,255,255,0.1)" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={[0, 'auto']}
              reversed={true}
              tickFormatter={(val) => displayMode === '$' ? `$${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}` : `${val}%`}
            />

            <Tooltip 
              contentStyle={{ backgroundColor: '#1a2130', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: any, name: any) => [
                displayMode === '$' ? `$${Number(value).toLocaleString()}` : `${Number(value).toFixed(2)}%`, 
                'Drawdown'
              ]}
            />

            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey={displayMode === '$' ? "drawdown" : "drawdownPct"} 
              fill="rgba(244, 63, 94, 0.1)" 
              stroke="#f43f5e" 
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
