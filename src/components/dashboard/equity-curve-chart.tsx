'use client'

import React from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area } from 'recharts';

export function EquityCurveChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const currentBalance = data[data.length - 1]?.balance || 0;
  const formatMoney = (val: number) => Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <Card className="bg-transparent border-transparent rounded-xl p-6 shadow-none flex flex-col h-full">
      <div className="flex justify-between items-start mb-6 shrink-0">
         <div>
             <span className="text-xl font-bold text-foreground">${formatMoney(currentBalance)}</span>
             <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <span className="text-xs text-muted-foreground">Account Balance</span>
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
              yAxisId="left"
              stroke="rgba(255,255,255,0.1)" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={['auto', 'auto']}
              tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a2130', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: any, name: any) => [`$${Number(value).toLocaleString()}`, name === 'balance' ? 'Balance' : name]}
            />

            <Area 
              yAxisId="left"
              type="stepAfter" 
              dataKey="balance" 
              fill="rgba(59, 130, 246, 0.1)" 
              stroke="#3b82f6" 
              strokeWidth={2} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
