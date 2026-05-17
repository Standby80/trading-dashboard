"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
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

export function AnalyticsSidebar({ cumulativeData, kpis }: { cumulativeData?: any[], kpis?: any }) {
  
  // Use real data or fallback to empty state
  const areaData = cumulativeData && cumulativeData.length > 0 ? cumulativeData : [
    { date: 'No Data', value: 0 }
  ];

  // Dynamic Radar Calculation based on KPIs
  // In a real app, these would have complex algorithms comparing user to platform averages
  const winScore = kpis ? Math.min(100, kpis.winRate * 1.5) : 50;
  const pfScore = kpis ? Math.min(100, kpis.profitFactor * 30) : 50;
  const avgScore = kpis && kpis.avgLoss > 0 ? Math.min(100, (kpis.avgWin / kpis.avgLoss) * 30) : 50;

  const radarData = [
    { subject: 'Win %', A: winScore, fullMark: 100 },
    { subject: 'Profit factor', A: pfScore, fullMark: 100 },
    { subject: 'Avg win/loss', A: avgScore, fullMark: 100 },
    { subject: 'Recovery factor', A: 70, fullMark: 100 }, // Mocked for MVP
    { subject: 'Max drawdown', A: 90, fullMark: 100 },    // Mocked for MVP
    { subject: 'Consistency', A: 75, fullMark: 100 },     // Mocked for MVP
  ];

  const metaMetricsScore = (winScore + pfScore + avgScore + 70 + 90 + 75) / 6;

  return (
    <>
      {/* MetaMetrics Score / Radar Chart */}
      <Card className="bg-[#131823] border-white/5 rounded-xl shadow-none">
        <CardHeader className="pb-0 pt-5 px-5">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
            MetaMetrics Score <Info className="w-4 h-4 text-slate-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex flex-col">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
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
          
          <div className="mt-4">
            <div className="text-xs text-slate-400 mb-1">Your MetaMetrics Score</div>
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

    {/* Cumulative P&L Graph */}
      <Card className="bg-[#131823] border-white/5 rounded-xl shadow-none">
        <CardHeader className="pb-0 pt-5 px-5">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
            Daily net cumulative P&L <Info className="w-4 h-4 text-slate-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#34d399" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#131823] border-white/5 rounded-xl shadow-none">
          <CardContent className="p-4">
            <div className="text-xs text-slate-400 mb-1">Max Win Streak</div>
            <div className="text-xl font-semibold text-emerald-400">{kpis?.maxWinStreak || 0} trades</div>
          </CardContent>
        </Card>
        <Card className="bg-[#131823] border-white/5 rounded-xl shadow-none">
          <CardContent className="p-4">
            <div className="text-xs text-slate-400 mb-1">Avg Trade Duration</div>
            <div className="text-xl font-semibold text-indigo-400">
              {kpis?.avgDurationMins ? `${Math.round(kpis.avgDurationMins)} min` : '-'}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
