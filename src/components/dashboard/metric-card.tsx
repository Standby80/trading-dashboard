'use client'

import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMemo } from "react";

const Sparkline = ({ color = "#10b981", trend = "neutral", title = "" }) => {
  // Generate a deterministic path based on the title
  const pathData = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const points = [];
    let currentY = trend === 'positive' ? 35 : trend === 'negative' ? 5 : 20;
    
    for (let i = 0; i <= 10; i++) {
      const x = i * 10;
      points.push(`${x},${currentY}`);
      
      // Pseudo-random movement based on hash and index
      const pseudoRandom = ((Math.sin(hash * (i + 1)) * 10000) % 100) / 100; // 0 to 1
      const volatility = 12;
      const move = (pseudoRandom - 0.5) * volatility;
      
      if (trend === 'positive') {
        currentY = Math.max(2, currentY - 3 + move);
      } else if (trend === 'negative') {
        currentY = Math.min(38, currentY + 3 + move);
      } else {
        currentY = Math.max(5, Math.min(35, currentY + move));
      }
    }
    
    const linePath = `M${points.join(' L')}`;
    const fillPath = `${linePath} L100,40 L0,40 Z`;
    
    return { linePath, fillPath };
  }, [title, trend]);

  return (
    <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
      <path d={pathData.fillPath} fill={`url(#gradient-${color.replace('#','')}-${title.replace(/\s+/g, '')})`} opacity="0.2" />
      <path d={pathData.linePath} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <defs>
        <linearGradient id={`gradient-${color.replace('#','')}-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export function MetricCard({ 
  title, 
  value, 
  subtext, 
  trend = 'neutral',
  valueColor,
  tooltip
}: { 
  title: string, 
  value: string | number, 
  subtext?: string, 
  trend?: 'positive' | 'negative' | 'neutral',
  valueColor?: string,
  tooltip?: string
}) {
  const color = trend === 'positive' ? '#10b981' : trend === 'negative' ? '#f43f5e' : '#64748b';
  const valColorClass = valueColor ? valueColor : (trend === 'positive' ? 'text-emerald-500' : trend === 'negative' ? 'text-rose-500' : 'text-white');
  const subtextColor = trend === 'positive' ? 'text-emerald-500' : trend === 'negative' ? 'text-rose-500' : 'text-slate-400';

  return (
    <Card className="bg-[#131823] border-[#1e2330] rounded-xl shadow-none overflow-hidden relative flex flex-col justify-between h-full">
      <CardContent className="p-4 flex flex-col h-full z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs text-slate-400 font-medium">{title}</span>
          {tooltip && (
            <UITooltip>
              <TooltipTrigger className="outline-none">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-white border-white/10 max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </UITooltip>
          )}
        </div>
        <div className={`text-2xl font-bold ${valColorClass}`}>
          {value}
        </div>
        {subtext && <span className={`text-[10px] mt-1 ${subtextColor}`}>{subtext}</span>}
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
         <Sparkline color={color} trend={trend} title={title} />
      </div>
    </Card>
  );
}
