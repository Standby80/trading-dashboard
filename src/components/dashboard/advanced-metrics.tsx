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
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            {t('tradeExecution')}
            <UITooltip>
              <TooltipTrigger className="outline-none"><Info className="w-4 h-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-foreground border-border w-64">
                 <p><strong>Risk to Reward:</strong> Avg Loss (Risk) vs Avg Win (Reward).<br/><strong>Hold Times:</strong> Time you stay in winning vs losing trades.</p>
              </TooltipContent>
            </UITooltip>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col relative">
          {!isPremium && (
            <div className="absolute inset-0 z-10 backdrop-blur-md bg-card/60 flex flex-col items-center justify-center p-4">
              <Lock className="w-8 h-8 text-indigo-400 mb-3" />
              <p className="text-sm font-medium text-foreground text-center mb-4 max-w-[200px]">
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
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Risk-to-Reward Ratio</span>
                </div>
                <span className="text-lg font-bold text-foreground">{rrRatio}</span>
              </div>
              
              <div className="w-full flex h-3 rounded-full overflow-hidden bg-slate-800">
                <div className="bg-rose-500 h-full transition-all" style={{ width: `${lossPct}%` }}></div>
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${winPct}%` }}></div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs font-medium">
                 <div className="flex flex-col">
                   <span className="text-muted-foreground text-[10px]">Avg Loss</span>
                   <span className="text-rose-500">-${avgLoss.toFixed(0)}</span>
                 </div>
                 <div className="flex flex-col items-end">
                   <span className="text-muted-foreground text-[10px]">Avg Win</span>
                   <span className="text-emerald-500">+${avgWin.toFixed(0)}</span>
                 </div>
              </div>
            </div>

            {/* Hold Times Section */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Hold Times</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground">Average Duration</span>
                  <span className="text-sm font-semibold text-foreground">{formatDuration(avgTotalDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground">Avg Win Hold Time</span>
                  <span className="text-sm font-semibold text-emerald-400">{formatDuration(avgWinDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground">Avg Loss Hold Time</span>
                  <span className="text-sm font-semibold text-rose-400">{formatDuration(avgLossDuration)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Longest Trade</span>
                  <span className="text-sm font-semibold text-foreground">{formatDuration(kpis.longestTradeMs)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Shortest Trade</span>
                  <span className="text-sm font-semibold text-foreground">{formatDuration(kpis.shortestTradeMs)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md bg-background border-border text-slate-50">
          <DialogHeader>
            <DialogTitle className="text-xl">Upgrade to Premium</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Get access to Risk-to-Reward analysis, hold times, automated MT5 live-sync, and the manual trading journal!
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-center">
               <h3 className="font-semibold mb-1">Thanks for your interest! 🎉</h3>
               <p className="text-sm">We are rolling out the payment system shortly. Your 50% discount code will be emailed to you.</p>
             </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="mt-5 space-y-3">
             <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Regular price</span>
                <span className="font-medium">$9.99 / month</span>
             </div>
             <div className="flex items-center justify-between text-sm font-bold text-emerald-400">
                <span>Your price (50% off)</span>
                <span>$4.99 / month</span>
             </div>
             <div className="pt-3 border-t border-indigo-500/20">
               <Input 
                 type="email" 
                 placeholder="Enter your email..." 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-foreground placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-2"
               />
               <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-colors text-sm">
                 Secure my 50% discount
                </Button>
             </div>
            </form>
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
        <div className="bg-[#1e293b] border border-border rounded-lg p-3 shadow-xl">
          <p className="text-foreground text-xs mb-1">{label}</p>
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
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            Time Analytics
            <UITooltip>
              <TooltipTrigger className="outline-none"><Info className="w-4 h-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
              <TooltipContent className="bg-[#1e293b] text-foreground border-border w-64">
                 <p>Net P&L based on the weekday or hour the trade was opened. All times are converted to Swedish time (CET/CEST).</p>
              </TooltipContent>
            </UITooltip>
          </CardTitle>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-md border border-border">
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

// --- WIDGET 3: Secondary Stats Row (Trades, Equity, Risk, Key Stats) ---
export function SecondaryStats({ data }: { data: any }) {
  if (!data || !data.kpis) return null;
  const { kpis } = data;
  
  const tradesWinPct = kpis.totalTrades > 0 ? (kpis.winningTrades / kpis.totalTrades) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {/* Trades */}
      <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-center h-full">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Trades</span>
          <span className="text-3xl font-bold text-foreground mb-1">{kpis.totalTrades}</span>
          <span className="text-xs text-muted-foreground mb-2">Total</span>
          <div className="flex gap-4 mt-auto">
             <div className="flex flex-col">
               <span className="text-emerald-500 font-bold">{kpis.winningTrades}</span>
               <span className="text-[10px] text-muted-foreground">Won</span>
             </div>
             <div className="flex flex-col">
               <span className="text-rose-500 font-bold">{kpis.losingTrades}</span>
               <span className="text-[10px] text-muted-foreground">Lost</span>
             </div>
          </div>
        </div>
        {/* Simple CSS Donut */}
        <div className="relative w-16 h-16 rounded-full border-4 border-border mr-2 flex items-center justify-center">
            {kpis.totalTrades > 0 && (
                <svg className="absolute inset-[-4px] w-[72px] h-[72px] -rotate-90">
                    <circle cx="36" cy="36" r="34" fill="none" stroke="#f43f5e" strokeWidth="4" />
                    <circle cx="36" cy="36" r="34" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${tradesWinPct * 2.13} 213`} />
                </svg>
            )}
        </div>
      </div>

      {/* Equity */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between h-full relative overflow-hidden">
        <div className="flex flex-col relative z-10">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Equity</span>
          <span className="text-2xl font-bold text-foreground">${kpis.currentBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
          <span className="text-[10px] text-muted-foreground mb-3">Account Value</span>
          
          <span className="text-lg font-bold text-emerald-400">${Math.abs(kpis.netProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-muted-foreground">Equity Growth</span>
        </div>
      </div>

      {/* Risk */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between h-full">
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Risk</span>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-emerald-500 font-bold">${(kpis.bestTrade || 0).toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground">Largest Win</span>
          </div>
          <div className="flex flex-col">
            <span className="text-rose-500 font-bold">-${Math.abs(kpis.worstTrade || 0).toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground">Largest Loss</span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between h-full">
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Key Stats</span>
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Avg. Win</span>
            <span className="text-emerald-500 font-medium">${(kpis.avgWin || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Avg. Loss</span>
            <span className="text-rose-500 font-medium">-${(kpis.avgLoss || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Max Drawdown</span>
            <span className="text-foreground font-medium">{((kpis.maxDrawdownDol || 0) / (kpis.peakBalance || 1) * 100).toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Sharpe Ratio</span>
            <span className="text-foreground font-medium">{kpis.sharpeRatio?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- WIDGET 4: Trade Distribution ---
export function TradeDistribution({ data }: { data: any }) {
  if (!data || !data.kpis) return null;
  const { kpis } = data;
  const tradesWinPct = kpis.totalTrades > 0 ? (kpis.winningTrades / kpis.totalTrades) * 100 : 0;
  
  return (
    <Card className="bg-transparent border-transparent rounded-xl shadow-none h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between border-b border-border">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Trade Distribution
        </CardTitle>
        <div className="flex bg-background rounded p-1 border border-border">
           <button className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground">By Asset</button>
           <button className="text-[10px] px-2 py-0.5 rounded text-muted-foreground hover:text-foreground">By Direction</button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[8px] border-border"></div>
            {kpis.totalTrades > 0 && (
                <svg className="absolute inset-[-8px] w-[144px] h-[144px] -rotate-90">
                    <circle cx="72" cy="72" r="64" fill="none" stroke="#f43f5e" strokeWidth="8" />
                    <circle cx="72" cy="72" r="64" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray={`${tradesWinPct * 4.02} 402`} />
                </svg>
            )}
            <div className="flex flex-col items-center text-center">
               <span className="text-2xl font-bold text-foreground">{kpis.totalTrades}</span>
               <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
        </div>
        
        <div className="w-full flex justify-between px-4 mt-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-muted-foreground">Winners</span>
                <span className="text-xs text-foreground font-medium ml-1">{kpis.winningTrades} ({tradesWinPct.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-xs text-muted-foreground">Losers</span>
                <span className="text-xs text-foreground font-medium ml-1">{kpis.losingTrades} ({(100 - tradesWinPct).toFixed(1)}%)</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- WIDGET 5: Drawdown Analysis ---
export function DrawdownAnalysis({ kpis }: { kpis: any }) {
  if (!kpis) return null;
  const ddPct = ((kpis.maxDrawdownDol || 0) / (kpis.peakBalance || 1) * 100).toFixed(2);
  
  return (
    <Card className="bg-transparent border-transparent rounded-xl shadow-none h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-border">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Drawdown Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-full border-[8px] border-border"></div>
            <svg className="absolute inset-[-8px] w-[144px] h-[144px] -rotate-90">
                <circle cx="72" cy="72" r="64" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="100 402" />
            </svg>
            <div className="flex flex-col items-center text-center">
               <span className="text-[10px] text-muted-foreground">Max<br/>Drawdown</span>
               <span className="text-lg font-bold text-foreground mt-1">{ddPct}%</span>
            </div>
        </div>
        
        <div className="w-full flex flex-col gap-2 mt-2 px-2">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                    <span className="text-xs text-muted-foreground">Current</span>
                </div>
                <span className="text-xs text-foreground font-medium">{ddPct}%</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted"></div>
                    <span className="text-xs text-muted-foreground">Previous Max</span>
                </div>
                <span className="text-xs text-foreground font-medium">-</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
