'use client'

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, Clock, Activity, Target, Lock } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- WIDGET 1: Trade Duration & R:R ---

const formatDuration = (ms: number) => {
  if (!ms || ms === 0) return '-';
  const mins = Math.floor(ms / (1000 * 60));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hrs < 24) return `${hrs}h ${remainingMins}m`;
  const days = Math.floor(hrs / 24);
  const remainingHrs = hrs % 24;
  return `${days}d ${remainingHrs}h`;
};

export function TradeExecutionWidget({ kpis, isPremium = false }: { kpis: any, isPremium?: boolean }) {
  const t = useTranslations('Dashboard');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  if (!kpis) return null;

  // Calculate R:R
  const avgWin = kpis.avgWin || 0;
  const avgLoss = kpis.avgLoss || 0;
  const rrRatio = avgLoss === 0 ? (avgWin > 0 ? '1 : ∞' : '0') : `1 : ${(avgWin / avgLoss).toFixed(2)}`;

  // Calculate Avg durations
  const avgWinDuration = kpis.winningTrades ? kpis.winDurationMs / kpis.winningTrades : 0;
  const avgLossDuration = kpis.losingTrades ? kpis.lossDurationMs / kpis.losingTrades : 0;
  const avgTotalDuration = kpis.totalTrades ? (kpis.winDurationMs + kpis.lossDurationMs) / kpis.totalTrades : 0;

  // Width calculation for R:R bar
  const totalBar = avgWin + avgLoss;
  const winPct = totalBar > 0 ? (avgWin / totalBar) * 100 : 50;
  const lossPct = totalBar > 0 ? (avgLoss / totalBar) * 100 : 50;

  return (
    <>
      <Card className="bg-transparent border-transparent rounded-xl shadow-none h-full overflow-hidden flex flex-col relative">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between border-b border-white/5">
          <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            {t('tradeExecution')}
            <UITooltip>
              <TooltipTrigger className="outline-none"><Info className="w-4 h-4 text-slate-500 cursor-pointer" /></TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-white border-white/10 w-64">
                 <p><strong>Risk to Reward:</strong> Avg Loss (Risk) vs Avg Win (Reward).<br/><strong>Hold Times:</strong> Tiden du stannar i vinnande vs förlorande trades.</p>
              </TooltipContent>
            </UITooltip>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col relative">
          {!isPremium && (
            <div className="absolute inset-0 z-10 backdrop-blur-md bg-[#131823]/60 flex flex-col items-center justify-center p-4">
              <Lock className="w-8 h-8 text-indigo-400 mb-3" />
              <p className="text-sm font-medium text-slate-200 text-center mb-4 max-w-[200px]">
                {t('upgradePremium')}
              </p>
              <Button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
              >
                Unlock Premium
              </Button>
            </div>
          )}
          
          <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto">
            {/* Risk to Reward Section */}
            <div>
              <div className="flex items-end justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Risk-to-Reward Ratio</span>
                </div>
                <span className="text-lg font-bold text-white">{rrRatio}</span>
              </div>
              
              <div className="w-full flex h-3 rounded-full overflow-hidden bg-slate-800">
                <div className="bg-rose-500 h-full transition-all" style={{ width: `${lossPct}%` }}></div>
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${winPct}%` }}></div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs font-medium">
                 <div className="flex flex-col">
                   <span className="text-slate-500 text-[10px]">Avg Loss</span>
                   <span className="text-rose-500">-${avgLoss.toFixed(0)}</span>
                 </div>
                 <div className="flex flex-col items-end">
                   <span className="text-slate-500 text-[10px]">Avg Win</span>
                   <span className="text-emerald-500">+${avgWin.toFixed(0)}</span>
                 </div>
              </div>
            </div>

            {/* Hold Times Section */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">Hold Times</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Average Duration</span>
                  <span className="text-sm font-semibold text-white">{formatDuration(avgTotalDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Avg Win Hold Time</span>
                  <span className="text-sm font-semibold text-emerald-400">{formatDuration(avgWinDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Avg Loss Hold Time</span>
                  <span className="text-sm font-semibold text-rose-400">{formatDuration(avgLossDuration)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Longest Trade</span>
                  <span className="text-sm font-semibold text-white">{formatDuration(kpis.longestTradeMs)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Shortest Trade</span>
                  <span className="text-sm font-semibold text-white">{formatDuration(kpis.shortestTradeMs)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md bg-[#0b0e14] border-white/5 text-slate-50">
          <DialogHeader>
            <DialogTitle className="text-xl">Upgrade to Premium</DialogTitle>
            <DialogDescription className="text-slate-400">
              Get access to Risk-to-Reward analysis, hold times, automated MT5 live-sync, and the manual trading journal!
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-center">
               <h3 className="font-semibold mb-1">Tack för ditt intresse! 🎉</h3>
               <p className="text-sm">Vi rullar ut betalsystemet inom kort. Din 50% rabattkod kommer på mailen.</p>
             </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="bg-[#131823] p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Premium Plan</span>
                  <span className="font-medium">99 kr / mån</span>
                </div>
                <div className="flex justify-between items-center text-sm text-indigo-400 font-medium">
                  <span>Your Early Bird Price</span>
                  <span>49 kr / mån</span>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#1a2130] border-white/10 text-white placeholder:text-slate-500"
                />
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Säkra min 50% rabatt
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- WIDGET 2: Time & Day Analytics ---

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function TimeAnalyticsWidget({ hourlyData = [], weekdayData = [] }: { hourlyData: number[], weekdayData: number[] }) {
  const [tab, setTab] = useState<'weekday' | 'hourly'>('weekday');

  // Format Weekday Data
  const weekdayChartData = WEEKDAYS.map((day, i) => ({
    name: day,
    pnl: weekdayData[i] || 0
  }));

  // Format Hourly Data
  const hourlyChartData = hourlyData.map((pnl, i) => ({
    name: `${i.toString().padStart(2, '0')}:00`,
    pnl: pnl || 0
  }));

  const activeData = tab === 'weekday' ? weekdayChartData : hourlyChartData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-[#1e293b] border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-xs mb-1">{label}</p>
          <p className={`text-sm font-bold ${val >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {val >= 0 ? '+' : '-'}${Math.abs(val).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-transparent border-transparent rounded-xl shadow-none flex flex-col h-full relative group/card overflow-hidden">
      <CardHeader className="pb-0 pt-5 px-5 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            Time Analytics
            <UITooltip>
              <TooltipTrigger className="outline-none"><Info className="w-4 h-4 text-slate-500 cursor-pointer" /></TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-white border-white/10 w-64">
                 <p>Net P&L based on the weekday or hour the trade was opened. All times are converted to Swedish time (CET/CEST).</p>
              </TooltipContent>
            </UITooltip>
          </CardTitle>
          <div className="flex items-center gap-1 bg-[#1a2130] p-1 rounded-md border border-white/5">
            <button 
              onClick={() => setTab('weekday')} 
              className={`text-[10px] font-medium px-2 py-1 rounded transition-colors ${tab === 'weekday' ? 'bg-[#2e364f] text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setTab('hourly')} 
              className={`text-[10px] font-medium px-2 py-1 rounded transition-colors ${tab === 'hourly' ? 'bg-[#2e364f] text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Hour
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 flex-1 min-h-[200px] flex flex-col">
        <div className="flex-1 w-full relative mt-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={activeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false}
                interval={tab === 'hourly' ? 3 : 0}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(val) => `$${Math.abs(val) > 1000 ? (val/1000).toFixed(1)+'k' : val}`}
              />
              <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
              <Bar dataKey="pnl" radius={[4, 4, 4, 4]}>
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#34d399' : '#f43f5e'} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
