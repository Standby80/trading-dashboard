'use client'

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function DrawdownChart({ data }: { data: any[] }) {
  const [showBalance, setShowBalance] = useState(true);
  const [showDrawdown, setShowDrawdown] = useState(true);

  if (!data || data.length === 0) return null;

  const currentBalance = data[data.length - 1]?.balance || 0;
  const currentDrawdownPct = data[data.length - 1]?.drawdownPct || 0;

  const formatMoney = (val: number) => Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <Card className="bg-transparent border-transparent rounded-xl p-6 shadow-none flex flex-col h-full">
      <div className="flex justify-between items-start mb-6 shrink-0">
         <div>
            <div className="flex gap-6">
               <div>
                 <span className="text-xl font-bold text-white">{formatMoney(currentBalance)}</span>
                 <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-xs text-slate-400">Balance</span>
                 </div>
               </div>
               <div>
                 <span className="text-xl font-bold text-white">{currentDrawdownPct.toFixed(2)}%</span>
                 <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                   <span className="text-xs text-slate-400">Drawdown</span>
                 </div>
               </div>
            </div>
         </div>
         <div className="flex gap-4 text-xs font-medium">
            <button 
              onClick={() => setShowDrawdown(!showDrawdown)}
              className={`transition-colors flex items-center gap-1.5 ${showDrawdown ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${showDrawdown ? 'bg-rose-500' : 'bg-slate-600'}`}></div>
              Drawdown
            </button>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className={`transition-colors flex items-center gap-1.5 ${showBalance ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${showBalance ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
              Balance
            </button>
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
            
            {/* Primary Axis for Balance */}
            <YAxis 
              yAxisId="left"
              stroke="rgba(255,255,255,0.1)" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={['auto', 'auto']}
              tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
            />
            
            {/* Secondary Axis for Drawdown (Inverted) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="rgba(255,255,255,0.1)" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={[0, 'auto']}
              reversed={true}
              tickFormatter={(val) => `${val}%`}
            />

            <Tooltip 
              contentStyle={{ backgroundColor: '#1a2130', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: any, name: any) => {
                 if (name === 'drawdownPct') return [`${value}%`, 'Drawdown'];
                 return [`$${value.toLocaleString()}`, name];
              }}
            />

            {/* Drawdown Area (Right Axis) */}
            {showDrawdown && (
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="drawdownPct" 
                fill="rgba(244, 63, 94, 0.1)" 
                stroke="#f43f5e" 
                strokeWidth={1}
              />
            )}

            {/* Balance Line (Left Axis) */}
            {showBalance && (
              <Line 
                yAxisId="left"
                type="stepAfter" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4 }} 
              />
            )}

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
