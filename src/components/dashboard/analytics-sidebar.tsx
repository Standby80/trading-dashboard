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

// Mock data for Radar Chart
const radarData = [
  { subject: 'Win %', A: 85, fullMark: 100 },
  { subject: 'Profit factor', A: 65, fullMark: 100 },
  { subject: 'Avg win/loss', A: 50, fullMark: 100 },
  { subject: 'Recovery factor', A: 70, fullMark: 100 },
  { subject: 'Max drawdown', A: 90, fullMark: 100 },
  { subject: 'Consistency', A: 75, fullMark: 100 },
];

// Mock data for Area Chart
const areaData = [
  { date: '03/19/23', value: 0 },
  { date: '04/01/24', value: 2000 },
  { date: '05/01/24', value: 3500 },
  { date: '06/11/24', value: 3000 },
  { date: '06/18/24', value: 5000 },
  { date: '06/24/24', value: 5500 },
  { date: '06/30/24', value: 7183 },
];

export function AnalyticsSidebar() {
  return (
    <>
      {/* Zella Score / Radar Chart */}
      <Card className="bg-[#131823] border-white/5 rounded-xl shadow-none">
        <CardHeader className="pb-0 pt-5 px-5">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
            Zella score <Info className="w-4 h-4 text-slate-500" />
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
            <div className="text-xs text-slate-400 mb-1">Your Zella Score</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold text-white">82.61</div>
            </div>
            {/* Custom gradient bar */}
            <div className="w-full h-1.5 rounded-full mt-3 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 relative">
               <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#131823] rounded-full" style={{ left: '82.61%' }}></div>
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
    </>
  );
}
