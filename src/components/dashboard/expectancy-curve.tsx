"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function ExpectancyCurve({ data }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-transparent border-transparent rounded-xl shadow-none">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Expectancy Curve</CardTitle>
          <CardDescription className="text-muted-foreground">Not enough data to project</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-transparent rounded-xl shadow-none col-span-full">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">Expectancy Curve (Next 100 Trades)</CardTitle>
        <CardDescription className="text-muted-foreground">
          Projection based on your historical Win Rate, Average Win, and Average Loss.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="w-full h-[350px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorExpectancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e364f" vertical={false} />
            <XAxis 
              dataKey="tradeNumber" 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 12}} 
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 12}}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
              itemStyle={{ color: '#818cf8' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Expected Growth']}
              labelFormatter={(label) => `Trade #${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="Expected Growth" 
              stroke="#818cf8" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorExpectancy)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
