'use client'

import { Card, CardContent } from "@/components/ui/card";
import { 
  HelpCircle, Wallet, TrendingUp, Target, Scale, Layers, 
  ArrowUpRight, ArrowDownRight, Activity, Percent, Clock, 
  BarChart2, Zap, Star, DollarSign
} from "lucide-react";
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
      <path d={pathData.linePath} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0px 0px 4px ' + color + '80)' }} />
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
  const valColorClass = valueColor ? valueColor : (trend === 'positive' ? 'text-emerald-500' : trend === 'negative' ? 'text-rose-500' : 'text-foreground');
  const subtextColor = trend === 'positive' ? 'text-emerald-500' : trend === 'negative' ? 'text-rose-500' : 'text-muted-foreground';

  const getIcon = (t: string) => {
    const s = t.toLowerCase();
    if (s.includes('equity') || s.includes('account value')) return <Wallet className="w-3.5 h-3.5 text-indigo-400" />;
    if (s.includes('p&l') || s.includes('profit')) return <DollarSign className={`w-3.5 h-3.5 ${trend === 'negative' ? 'text-rose-400' : 'text-emerald-400'}`} />;
    if (s.includes('win rate')) return <Target className="w-3.5 h-3.5 text-indigo-400" />;
    if (s.includes('profit factor') || s.includes('ratio') || s.includes('rr')) return <Scale className="w-3.5 h-3.5 text-indigo-400" />;
    if (s.includes('trades') || s.includes('frequency')) return <Activity className="w-3.5 h-3.5 text-indigo-400" />;
    if (s.includes('average win') || s.includes('best') || s.includes('expectancy')) return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />;
    if (s.includes('average loss') || s.includes('worst')) return <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />;
    if (s.includes('sharpe') || s.includes('recovery')) return <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />;
    if (s.includes('drawdown')) return <Zap className="w-3.5 h-3.5 text-rose-400" />;
    if (s.includes('commission')) return <Percent className="w-3.5 h-3.5 text-rose-400" />;
    if (s.includes('streak')) return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
    if (s.includes('time') || s.includes('duration') || s.includes('hour') || s.includes('diff')) return <Clock className="w-3.5 h-3.5 text-indigo-400" />;
    if (s.includes('asset')) return <Star className="w-3.5 h-3.5 text-yellow-400" />;
    return <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <Card className="bg-card border-none rounded-xl shadow-[var(--shadow-neumorph)] overflow-hidden relative flex flex-col justify-between h-full hover:shadow-[var(--shadow-neumorph-sm)] hover:-translate-y-[1px] transition-all duration-300">
      <CardContent className="p-4 flex flex-col h-full z-10">
        <div className="flex items-center gap-1.5 mb-2 relative z-20">
          <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {getIcon(title)}
          </div>
          <span className="text-xs text-muted-foreground font-medium truncate flex-1">{title}</span>
          {tooltip && (
            <UITooltip>
              <TooltipTrigger className="outline-none shrink-0" asChild>
                <div className="p-1">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-foreground transition-colors cursor-help" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs z-[100]" sideOffset={5}>
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </UITooltip>
          )}
        </div>
        <div className={`text-2xl font-bold ${valColorClass} tracking-tight`}>
          {value}
        </div>
        {subtext && <span className={`text-[10px] mt-1 ${subtextColor}`}>{subtext}</span>}
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
         <Sparkline color={color} trend={trend} title={title} />
      </div>
    </Card>
  );
}
