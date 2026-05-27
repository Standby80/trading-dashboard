"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { useTranslations } from "next-intl";

export function AnalyticsSidebar({ cumulativeData, kpis }: { cumulativeData?: any[], kpis?: any }) {
  const t = useTranslations('Dashboard');
  
  // Use real data or fallback to empty state
  const areaData = cumulativeData && cumulativeData.length > 0 ? cumulativeData : [
    { date: 'No Data', value: 0 }
  ];

  // Dynamic Radar Calculation based on KPIs
  const metaMetrics = kpis?.metaMetrics || {
    winRateScore: 50,
    profitFactorScore: 50,
    consistencyScore: 50,
    drawdownScore: 50,
    recoveryScore: 50,
    totalScore: 50
  };

  const radarData = [
    { subject: 'Win %', A: metaMetrics.winRateScore, fullMark: 100 },
    { subject: 'Profit factor', A: metaMetrics.profitFactorScore, fullMark: 100 },
    { subject: 'Consistency', A: metaMetrics.consistencyScore, fullMark: 100 },
    { subject: 'Recovery factor', A: metaMetrics.recoveryScore, fullMark: 100 },
    { subject: 'Max drawdown', A: metaMetrics.drawdownScore, fullMark: 100 },
  ];

  const metaMetricsScore = metaMetrics.totalScore;

  return (
    <>
      {/* MetaMetrics Score / Radar Chart */}
      <Card className="bg-transparent border-transparent rounded-xl shadow-none flex-1 flex flex-col h-full min-h-0">
        <CardHeader className="pb-0 pt-5 px-5 shrink-0">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            {t('metaMetricsScore')}
            <UITooltip>
              <TooltipTrigger className="outline-none"><Info className="w-4 h-4 text-slate-500 cursor-pointer" /></TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-white border-border"><p>{t('metaMetricsTooltip')}</p></TooltipContent>
            </UITooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#2e364f" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 shrink-0">
            <div className="text-xs text-slate-400 mb-1">{t('metaMetricsScore')}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold text-white">{metaMetricsScore.toFixed(2)}</div>
            </div>
            <div className="w-full h-1.5 rounded-full mt-3 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 relative">
               <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#131823] rounded-full" style={{ left: `${metaMetricsScore}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-500">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
