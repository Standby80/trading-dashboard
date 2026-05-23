'use client';

import React, { useState } from 'react';
import { HelpCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const formatPct = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

const formatDol = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export function MonthlyHeatmap({ kpis }: { kpis: any }) {
  const [viewMode, setViewMode] = useState<'heatmap' | 'chart'>('heatmap');
  const [valueMode, setValueMode] = useState<'pct' | 'dol'>('pct');

  if (!kpis || !kpis.monthlyHeatmapPct || !kpis.monthlyHeatmapDol) return null;

  const data = valueMode === 'pct' ? kpis.monthlyHeatmapPct : kpis.monthlyHeatmapDol;
  const years = Object.keys(data).sort((a, b) => Number(b) - Number(a));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (years.length === 0) return null;

  let bestMonth = { label: '', pct: -Infinity };
  let worstMonth = { label: '', pct: Infinity };
  let totalPct = 0;
  let activeMonths = 0;

  years.forEach(year => {
    months.forEach(month => {
      const val = data[year][month];
      if (val !== undefined && val !== null && val !== 0) {
        const label = `${month} ${year}`;
        if (val > bestMonth.pct) bestMonth = { label, pct: val };
        if (val < worstMonth.pct) worstMonth = { label, pct: val };
        totalPct += val;
        activeMonths++;
      }
    });
  });

  const avgMonthPct = activeMonths > 0 ? totalPct / activeMonths : 0;

  // Prepare chart data (chronological)
  const chartData: any[] = [];
  years.slice().reverse().forEach(year => {
    months.forEach(month => {
      const val = data[year][month];
      if (val !== undefined && val !== null) {
        chartData.push({
          name: `${month} ${year}`,
          value: val
        });
      }
    });
  });

  return (
    <div className="w-full flex flex-col relative h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          Monthly P/L
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-help" />
        </h3>
        <div className="flex gap-2">
          <div className="flex bg-[#1e2330] rounded-md overflow-hidden border border-white/5 text-xs">
            <button 
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 transition-colors ${viewMode === 'chart' ? 'bg-[#2c3344] text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Chart
            </button>
            <button 
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 transition-colors ${viewMode === 'heatmap' ? 'bg-[#2c3344] text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Heatmap
            </button>
          </div>
          <div className="flex bg-[#1e2330] rounded-md overflow-hidden border border-white/5 text-xs">
            <button 
              onClick={() => setValueMode('dol')}
              className={`px-2 py-1.5 transition-colors ${valueMode === 'dol' ? 'bg-[#2c3344] text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              $
            </button>
            <button 
              onClick={() => setValueMode('pct')}
              className={`px-2 py-1.5 transition-colors ${valueMode === 'pct' ? 'bg-[#2c3344] text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              %
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 relative min-h-0">
        {viewMode === 'heatmap' ? (
          <table className="w-full text-left border-collapse min-w-[600px] h-full">
            <thead>
              <tr>
                <th className="py-2 px-3 text-xs font-medium text-slate-500 font-mono">Datum</th>
                {months.map(m => (
                  <th key={m} className="py-2 px-3 text-xs font-medium text-slate-300 text-center">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {years.map(year => (
                <tr key={year} className="border-t border-white/5">
                  <td className="py-3 px-3 text-sm font-medium text-slate-400 font-mono">{year}</td>
                  {months.map(month => {
                    const val = data[year][month];
                    const hasData = val !== undefined && val !== null;
                    
                    let bgColorClass = "bg-transparent";
                    let textColorClass = "text-slate-600";
                    let displayVal = "-";

                    if (hasData) {
                      displayVal = valueMode === 'pct' ? formatPct(val) : formatDol(val);
                      if (val > 0) {
                        bgColorClass = "bg-emerald-500/20";
                        textColorClass = "text-emerald-400";
                      } else if (val < 0) {
                        bgColorClass = "bg-rose-500/20";
                        textColorClass = "text-rose-400";
                      } else {
                        bgColorClass = "bg-slate-500/20";
                        textColorClass = "text-slate-400";
                      }
                    }

                    return (
                      <td key={`${year}-${month}`} className="p-0.5">
                        <div className={`w-full h-9 flex items-center justify-center text-xs font-medium rounded-sm transition-colors ${bgColorClass} ${textColorClass}`}>
                          {displayVal}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="w-full h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e364f" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 10}} 
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 10}}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => valueMode === 'pct' ? `${val}%` : `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  formatter={(val: number) => [valueMode === 'pct' ? formatPct(val) : formatDol(val), 'P/L']}
                />
                <Bar dataKey="value" radius={[2, 2, 2, 2]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto pt-4 border-t border-white/5 shrink-0">
        <div className="bg-transparent rounded-lg p-3">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Best Month</span>
          <div className="text-sm font-bold text-slate-200">
            {bestMonth.label !== '' ? bestMonth.label : '-'} <span className="text-slate-500 mx-1">•</span> <span className="text-emerald-400">{bestMonth.pct !== -Infinity ? (valueMode === 'pct' ? formatPct(bestMonth.pct) : formatDol(bestMonth.pct)) : '-'}</span>
          </div>
        </div>
        <div className="bg-transparent rounded-lg p-3">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Worst</span>
          <div className="text-sm font-bold text-slate-200">
            {worstMonth.label !== '' ? worstMonth.label : '-'} <span className="text-slate-500 mx-1">•</span> <span className="text-rose-400">{worstMonth.pct !== Infinity ? (valueMode === 'pct' ? formatPct(worstMonth.pct) : formatDol(worstMonth.pct)) : '-'}</span>
          </div>
        </div>
        <div className="bg-transparent rounded-lg p-3">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Month</span>
          <div className="text-sm font-bold text-slate-200">
            {valueMode === 'pct' ? formatPct(avgMonthPct) : formatDol(avgMonthPct)}
          </div>
        </div>
      </div>
    </div>
  );
}
