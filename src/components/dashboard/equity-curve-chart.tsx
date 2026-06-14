'use client'

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Area } from 'recharts';
import { Percent, DollarSign } from "lucide-react";

export function EquityCurveChart({ data }: { data: any[] }) {
  const [displayMode, setDisplayMode] = useState<'$' | '%'>('$');

  if (!data || data.length === 0) return null;

  const initialBalance = data[0]?.balance || 0;
  const processedData = data.map(d => ({
    ...d,
    growthPct: initialBalance > 0 ? ((d.balance - initialBalance) / initialBalance) * 100 : 0
  }));

  const currentBalance = processedData[processedData.length - 1]?.balance || 0;
  const currentGrowthPct = processedData[processedData.length - 1]?.growthPct || 0;
  
  const formatMoney = (val: number) => Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <Card className="bg-transparent border-0 ring-0 rounded-xl p-6 shadow-none flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Growth</span>
        <div className="flex bg-background rounded p-1 border border-border">
          <button 
             onClick={() => setDisplayMode('$')}
             className={`flex items-center justify-center p-1 rounded transition-colors ${displayMode === '$' ? 'bg-muted text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
             title="Show Balance"
          >
             <DollarSign className="w-3.5 h-3.5" />
          </button>
          <button 
             onClick={() => setDisplayMode('%')}
             className={`flex items-center justify-center p-1 rounded transition-colors ${displayMode === '%' ? 'bg-muted text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
             title="Show Growth %"
          >
             <Percent className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6 shrink-0">
         <div>
             <span className="text-xl font-bold text-foreground">
               {displayMode === '$' ? `$${formatMoney(currentBalance)}` : `${currentGrowthPct > 0 ? '+' : ''}${currentGrowthPct.toFixed(2)}%`}
             </span>
             <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <span className="text-xs text-muted-foreground">Account Balance</span>
             </div>
         </div>
      </div>

      <div className="flex-1 w-full min-h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.1)" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickMargin={10}
              minTickGap={30}
            />
            
            <YAxis 
              yAxisId="left"
              stroke="rgba(255,255,255,0.1)" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={['auto', 'auto']}
              tickFormatter={(val) => displayMode === '$' ? `${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}` : `${val.toFixed(1)}%`}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: any, name: any) => [
                displayMode === '$' ? `$${Number(value).toLocaleString()}` : `${Number(value).toFixed(2)}%`, 
                displayMode === '$' ? 'Balance' : 'Growth'
              ]}
            />

            <Area 
              yAxisId="left"
              type="stepAfter" 
              dataKey={displayMode === '$' ? "balance" : "growthPct"} 
              fill="rgba(59, 130, 246, 0.1)" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              className="drop-shadow-none md:drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
