'use client';

import { TrendingDown, TrendingUp, AlertTriangle, Activity, Zap } from "lucide-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const formatPct = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export function PsychologyGrid({ kpis }: { kpis: any }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
      
      {/* Revenge Trading */}
      <div className="bg-transparent p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Zap className="w-24 h-24 text-rose-500 -mt-4 -mr-4" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-4 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500/70" />
          Revenge Trading <span className="text-slate-600 lowercase font-normal ml-1">(&lt;10 min)</span>
        </div>
        <div className="mt-auto">
          <div className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            {kpis.revengeTradesCount} <span className="text-sm font-medium text-muted-foreground ml-1 tracking-normal">trades</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <span>(Ø {formatCurrency(kpis.revengeTradesAvgPnl)}</span>
            <span className="text-slate-600">|</span>
            <span className={kpis.revengeTradesTotalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
              Σ {formatCurrency(kpis.revengeTradesTotalPnl)}
            </span>
            <span>)</span>
          </div>
        </div>
      </div>

      {/* Overtrading Impact */}
      <div className="bg-transparent p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Activity className="w-24 h-24 text-rose-500 -mt-4 -mr-4" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-4 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500/70" />
          Overtrading <span className="text-slate-600 lowercase font-normal ml-1">(&gt;5 trades/day)</span>
        </div>
        <div className="mt-auto">
          <div className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            {kpis.overtradingDaysCount} <span className="text-sm font-medium text-muted-foreground ml-1 tracking-normal">days</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <span>(Ø {formatCurrency(kpis.overtradingAvgPnl)}</span>
            <span className="text-slate-600">|</span>
            <span className={kpis.overtradingTotalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
              Σ {formatCurrency(kpis.overtradingTotalPnl)}
            </span>
            <span>)</span>
          </div>
        </div>
      </div>

      {/* Trading Streaks */}
      <div className="bg-transparent p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-6 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-indigo-400/70" />
          Trading Streaks
        </div>
        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Max Wins (Count)</span>
            <span className="text-sm font-bold text-emerald-400">{kpis.longestWinStreak?.count || 0} <span className="text-[11px] font-medium text-emerald-400/60 ml-1">({formatCurrency(kpis.longestWinStreak?.pnl || 0)})</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Max Wins (PNL)</span>
            <span className="text-sm font-bold text-emerald-400">{formatCurrency(kpis.highestPnlWinStreak?.pnl || 0)} <span className="text-[11px] font-medium text-emerald-400/60 ml-1">({kpis.highestPnlWinStreak?.count || 0})</span></span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs text-muted-foreground">Avg Win Streak</span>
            <span className="text-sm font-bold text-foreground">{kpis.avgWinStreakCount || 0}</span>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">Max Losses (Count)</span>
            <span className="text-sm font-bold text-rose-400">{kpis.longestLoseStreak?.count || 0} <span className="text-[11px] font-medium text-rose-400/60 ml-1">({formatCurrency(kpis.longestLoseStreak?.pnl || 0)})</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Max Losses (PNL)</span>
            <span className="text-sm font-bold text-rose-400">{formatCurrency(kpis.highestPnlLoseStreak?.pnl || 0)} <span className="text-[11px] font-medium text-rose-400/60 ml-1">({kpis.highestPnlLoseStreak?.count || 0})</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Avg Lose Streak</span>
            <span className="text-sm font-bold text-foreground">{kpis.avgLoseStreakCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Trade Extremes & Averages */}
      <div className="bg-transparent p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-6 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-amber-400/70" />
          Extremes & Averages
        </div>
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex flex-col gap-3 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Largest Win</span>
              <div className="text-right">
                <span className="text-[15px] font-bold text-emerald-400 block leading-none mb-1">{formatCurrency(kpis.bestTrade)}</span>
                <span className="text-[10px] font-medium text-emerald-400/60 uppercase">{formatPct(kpis.largestWinPct)} of capital</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Largest Loss</span>
              <div className="text-right">
                <span className="text-[15px] font-bold text-rose-400 block leading-none mb-1">{formatCurrency(kpis.worstTrade)}</span>
                <span className="text-[10px] font-medium text-rose-400/60 uppercase">{formatPct(kpis.largestLossPct)} of capital</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Average Win</span>
              <span className="text-[15px] font-bold text-emerald-400">{formatCurrency(kpis.avgWin)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Average Loss</span>
              <span className="text-[15px] font-bold text-rose-400">{formatCurrency(kpis.avgLoss)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
