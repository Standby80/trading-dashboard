'use client'

import { Card, CardContent } from "@/components/ui/card";

const Sparkline = ({ color = "#10b981" }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
    <path d="M0,40 L0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,15 L70,5 L80,10 L90,2 L100,0 L100,40 Z" fill={`url(#gradient-${color.replace('#','')})`} opacity="0.2" />
    <path d="M0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,15 L70,5 L80,10 L90,2 L100,0" fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    <defs>
      <linearGradient id={`gradient-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="1"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

export function MetricCard({ 
  title, 
  value, 
  subtext, 
  trend = 'neutral',
  valueColor
}: { 
  title: string, 
  value: string | number, 
  subtext?: string, 
  trend?: 'positive' | 'negative' | 'neutral',
  valueColor?: string
}) {
  const color = trend === 'positive' ? '#10b981' : trend === 'negative' ? '#f43f5e' : '#64748b';
  const valColorClass = valueColor ? valueColor : (trend === 'positive' ? 'text-emerald-500' : trend === 'negative' ? 'text-rose-500' : 'text-white');
  const subtextColor = trend === 'positive' ? 'text-emerald-500' : trend === 'negative' ? 'text-rose-500' : 'text-slate-400';

  return (
    <Card className="bg-[#131823] border-[#1e2330] rounded-xl shadow-none overflow-hidden relative flex flex-col justify-between h-full">
      <CardContent className="p-4 flex flex-col h-full z-10">
        <span className="text-xs text-slate-400 mb-2 font-medium">{title}</span>
        <div className={`text-2xl font-bold ${valColorClass}`}>
          {value}
        </div>
        {subtext && <span className={`text-[10px] mt-1 ${subtextColor}`}>{subtext}</span>}
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
         <Sparkline color={color} />
      </div>
    </Card>
  );
}
