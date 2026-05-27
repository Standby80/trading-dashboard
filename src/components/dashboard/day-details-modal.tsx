'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Eye } from 'lucide-react'

interface Trade {
  ticket_id: string;
  symbol: string;
  open_time: string;
  close_time: string;
  open_price: number;
  close_price: number;
  profit: number;
  swap?: number;
  commission?: number;
  type?: string;
  volume?: number;
}

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  trades: Trade[];
}

export function DayDetailsModal({ isOpen, onClose, date, trades }: DayDetailsModalProps) {
  if (!isOpen) return null;

  const validTrades = trades.filter(t => t.type !== 'BALANCE' && t.type !== 'DEAL_TYPE_BALANCE');
  const sortedTrades = [...validTrades].sort((a, b) => new Date(a.close_time).getTime() - new Date(b.close_time).getTime());

  // Calculate Metrics
  let totalProfit = 0;
  let wins = 0;
  let grossWin = 0;
  let grossLoss = 0;

  const chartData = [{ time: 'Start', pnl: 0 }];
  let cumulative = 0;

  const processedTrades = sortedTrades.map(trade => {
    const netProfit = Number(trade.profit) + Number(trade.swap || 0) + Number(trade.commission || 0);
    totalProfit += netProfit;
    cumulative += netProfit;
    
    if (netProfit > 0) {
      wins++;
      grossWin += netProfit;
    } else if (netProfit < 0) {
      grossLoss += netProfit;
    }

    const timeStr = new Date(trade.close_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    chartData.push({ time: timeStr, pnl: Number(cumulative.toFixed(2)) });

    return { ...trade, netProfit };
  });

  const totalTrades = processedTrades.length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const avgWin = wins > 0 ? grossWin / wins : 0;
  const losses = totalTrades - wins;
  const avgLoss = losses > 0 ? grossLoss / losses : 0;

  const isPositiveDay = totalProfit >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[800px] md:max-w-4xl lg:max-w-5xl bg-background border-border text-slate-50 p-0 overflow-hidden shadow-2xl">
        <div className="p-6 pb-2 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              Trading Day: {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Top Section: Chart & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Chart Area */}
            <div className="lg:col-span-3 bg-card rounded-xl border border-border p-5 relative">
              <div className="mb-4">
                <span className="text-sm font-semibold text-slate-400 mr-2">Day P/L</span>
                <span className={`text-xl font-bold ${isPositiveDay ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {isPositiveDay ? '+' : ''}${totalProfit.toFixed(2)}
                </span>
              </div>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPositiveDay ? '#34d399' : '#f43f5e'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isPositiveDay ? '#34d399' : '#f43f5e'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      dy={10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Cumulative P/L']}
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="pnl" 
                      stroke={isPositiveDay ? '#34d399' : '#f43f5e'} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPnl)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total Trades</div>
                <div className="text-xl font-bold text-white">{totalTrades}</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Win Rate %</div>
                <div className="text-xl font-bold text-white">{winRate.toFixed(1)}%</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Average Win</div>
                <div className="text-xl font-bold text-emerald-400">+${avgWin.toFixed(2)}</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Average Loss</div>
                <div className="text-xl font-bold text-rose-500">${avgLoss.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Trades List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Trade History</h4>
            {processedTrades.length === 0 ? (
              <div className="text-center py-8 text-slate-500 bg-card rounded-xl border border-border">
                No trades recorded for this day.
              </div>
            ) : (
              processedTrades.map((trade, i) => {
                const isWin = trade.netProfit >= 0;
                return (
                  <div key={`${trade.ticket_id}-${i}`} className="bg-card border border-border rounded-xl overflow-hidden flex relative group hover:border-border transition-colors">
                    {/* Left Border Status */}
                    <div className={`w-1.5 absolute left-0 top-0 bottom-0 ${isWin ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    
                    <div className="flex-1 p-4 pl-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-opacity-10 ${isWin ? 'bg-emerald-500 text-emerald-400' : 'bg-rose-500 text-rose-400'}`}>
                          {isWin ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{trade.symbol}</div>
                          <div className="text-xs text-slate-400 mt-0.5 flex gap-3">
                            <span>Entry: <span className="text-slate-300 font-mono">{trade.open_price}</span></span>
                            <span>Exit: <span className="text-slate-300 font-mono">{trade.close_price}</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <div className={`text-lg font-bold font-mono ${isWin ? 'text-emerald-400' : 'text-rose-500'}`}>
                            {isWin ? '+' : ''}${trade.netProfit.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(trade.open_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(trade.close_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
