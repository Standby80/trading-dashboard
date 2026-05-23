'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Settings, Info, Calendar as CalendarIcon, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

import { Plus, FileText } from "lucide-react";

export function TradingCalendar({ data, availableSymbols = [] }: { data?: Record<string, { pnl: number, trades: number, wins: number, balanceAtStartOfDay?: number, grossProfit?: number, grossLoss?: number }>, availableSymbols?: string[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'dollar' | 'percent'>('dollar');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSymbols = searchParams.get('symbols')?.split(',') || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSymbolToggle = (sym: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let newSymbols = [...currentSymbols];
    
    // If no symbols are selected in URL, it means "All" are selected by default.
    if (currentSymbols.length === 0) {
      newSymbols = availableSymbols.filter(s => s !== sym);
    } else {
      if (newSymbols.includes(sym)) {
        newSymbols = newSymbols.filter(s => s !== sym);
      } else {
        newSymbols.push(sym);
      }
    }

    if (newSymbols.length === 0 || newSymbols.length === availableSymbols.length) {
      params.delete('symbols');
    } else {
      params.set('symbols', newSymbols.join(','));
    }
    router.push(`/?${params.toString()}`);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleThisMonth = () => {
    setCurrentDate(new Date());
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  
  // Force 'en-US' to prevent Next.js hydration mismatch between server and client browser locales
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  // Generate days array based on real data or empty
  const calendarDays = [];
  
  // Padding for start of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Actual days
  let monthlyPnl = 0;
  let activeDays = 0;
  const weeklyTotals = [0, 0, 0, 0, 0, 0];
  const weeklyActiveDays = [0, 0, 0, 0, 0, 0];
  const weeklyTrades = [0, 0, 0, 0, 0, 0];
  const weeklyWins = [0, 0, 0, 0, 0, 0];
  const weeklyGrossProfit = [0, 0, 0, 0, 0, 0];
  const weeklyGrossLoss = [0, 0, 0, 0, 0, 0];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = data?.[dateStr];
    
    if (dayData) {
      monthlyPnl += dayData.pnl;
      activeDays++;
      const weekIndex = Math.floor((firstDayOfWeek + day - 1) / 7);
      weeklyTotals[weekIndex] += dayData.pnl;
      weeklyActiveDays[weekIndex]++;
      weeklyTrades[weekIndex] += dayData.trades;
      weeklyWins[weekIndex] += dayData.wins;
      weeklyGrossProfit[weekIndex] += dayData.grossProfit || 0;
      weeklyGrossLoss[weekIndex] += dayData.grossLoss || 0;
      
      const rrr = dayData.grossLoss && dayData.grossLoss > 0 
        ? ((dayData.grossProfit || 0) / dayData.grossLoss).toFixed(2) 
        : ((dayData.grossProfit || 0) > 0 ? (dayData.grossProfit || 0).toFixed(2) : '0.00');

      calendarDays.push({
        day,
        status: dayData.pnl >= 0 ? 'win' : 'loss',
        pnl: dayData.pnl,
        balanceAtStartOfDay: dayData.balanceAtStartOfDay || 0,
        trades: dayData.trades,
        winRate: dayData.trades > 0 ? Math.round((dayData.wins / dayData.trades) * 100) + '%' : '0%',
        rrr
      });
    } else {
      calendarDays.push({ day, status: 'neutral', pnl: null, trades: 0, winRate: null, rrr: null });
    }
  }

  // Padding for end of month to make 5 or 6 full rows
  const totalSlots = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  for (let i = calendarDays.length; i < totalSlots; i++) {
    calendarDays.push(null);
  }

  const weeksCount = totalSlots / 7;

  return (
    <Card className="bg-transparent border-transparent rounded-xl shadow-none h-full overflow-hidden flex flex-col">
      {/* Calendar Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-white/5 rounded transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-medium text-white px-2 min-w-[120px] text-center">
               {mounted ? `${monthName} ${year}` : 'Loading...'}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-white/5 rounded transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button onClick={handleThisMonth} className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-md text-sm font-medium border border-indigo-500/20 hover:bg-indigo-600/30 transition-colors">
            This month
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            Monthly stats: 
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${monthlyPnl >= 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'}`}>
              ${Math.abs(monthlyPnl).toFixed(0)}
            </span>
            <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs font-medium border border-indigo-500/20">{activeDays} days</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none hover:text-white text-slate-400 transition-colors">
              <Settings className="w-4 h-4 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#131823] border border-white/10 text-slate-300">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Calendar Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-sm">Show Percentage (%)</span>
                  <Switch 
                    checked={viewMode === 'percent'}
                    onCheckedChange={(c) => setViewMode(c ? 'percent' : 'dollar')}
                  />
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter Symbols</DropdownMenuLabel>
                {availableSymbols.map(sym => {
                   // If currentSymbols is empty, everything is checked by default
                   const isChecked = currentSymbols.length === 0 || currentSymbols.includes(sym);
                   return (
                     <DropdownMenuCheckboxItem 
                       key={sym}
                       checked={isChecked}
                       onCheckedChange={() => handleSymbolToggle(sym)}
                       className="hover:bg-[#1a2130]"
                     >
                       {sym}
                     </DropdownMenuCheckboxItem>
                   )
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger className="outline-none hover:text-white text-slate-400 transition-colors">
              <Info className="w-4 h-4 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1e293b] text-white border-white/10">
              <p>Daily net P&L and total trades taken</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-1 h-full min-h-0">
        {/* Main Grid */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          {/* Days of week */}
          <div className="grid grid-cols-7 border-b border-white/5 bg-[#1a2130]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="py-2 text-center text-xs font-medium text-slate-400">
                {d}
              </div>
            ))}
          </div>
          
          {/* Calendar Cells */}
          <div className={`flex-1 grid grid-cols-7 grid-rows-${weeksCount} bg-[#0b0e14] gap-[1px]`}>
             {calendarDays.map((d, i) => {
               if (!d) return <div key={`empty-${i}`} className="bg-[#131823]"></div>;
               
               return (
                 <div 
                    key={d.day} 
                    className={`relative p-2.5 flex flex-col transition-colors border-r border-b border-transparent ${
                      d.status === 'win' ? 'bg-[#103024]/40 hover:bg-[#154232]/60 border-[#154232]' : 
                      d.status === 'loss' ? 'bg-[#3b1717]/40 hover:bg-[#4d1d1d]/60 border-[#4d1d1d]' : 
                      'bg-[#131823] hover:bg-[#1a2130] border-white/5'
                    }`}
                  >
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-slate-200 text-[13px] font-semibold">{d.day}</span>
                     <div className="flex items-center gap-1">
                       {d.pnl !== null && <FileText className="w-3 h-3 text-indigo-400 opacity-60" />}
                       <Plus className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                     </div>
                   </div>
                   {d.pnl !== null && (
                     <div className="flex flex-col gap-0.5 mt-auto w-full">
                       <span className={`font-bold ${d.status === 'win' ? 'text-emerald-500' : 'text-rose-500'} ${viewMode === 'percent' ? 'text-xs' : 'text-sm'} mb-0.5`}>
                         {d.pnl >= 0 ? '+' : ''}
                         {viewMode === 'percent' 
                           ? (d.balanceAtStartOfDay > 0 ? ((d.pnl / d.balanceAtStartOfDay) * 100).toFixed(2) + '%' : '0.00%')
                           : `$${Math.abs(d.pnl).toFixed(2)}`
                         }
                       </span>
                       <span className="text-[11px] text-slate-400 leading-tight">{d.trades} {d.trades === 1 ? 'trade' : 'trades'}</span>
                       <span className="text-[11px] text-slate-400 leading-tight">{d.winRate} winrate</span>
                       <span className="text-[11px] text-slate-400 leading-tight">{d.rrr} RRR</span>
                     </div>
                   )}
                 </div>
               )
             })}
          </div>
        </div>

        {/* Weekly Sidebar */}
        <div className="w-32 bg-[#131823] flex flex-col gap-[1px]">
          <div className="h-[33px] border-b border-white/5 bg-[#1a2130] flex items-center justify-center">
             <span className="text-xs font-medium text-slate-400">Weekly P/L</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-[1px] bg-[#0b0e14]">
            {Array.from({ length: weeksCount }).map((_, i) => {
              const amount = weeklyTotals[i];
              const trades = weeklyTrades[i];
              const wins = weeklyWins[i];
              const gp = weeklyGrossProfit[i];
              const gl = weeklyGrossLoss[i];
              const isProfit = amount >= 0;
              const winRate = trades > 0 ? Math.round((wins / trades) * 100) : 0;
              const rrr = gl > 0 ? (gp / gl).toFixed(2) : (gp > 0 ? gp.toFixed(2) : '0.00');
              
              if (trades === 0) return (
                 <div key={i} className="flex-1 bg-[#131823] flex flex-col p-2.5"></div>
              );

              return (
                <div key={i} className="flex-1 bg-[#131823] flex flex-col p-2.5">
                  <div className="flex justify-end items-start mb-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80"></div>
                  </div>
                  <div className="flex flex-col gap-0.5 mt-auto">
                    <span className={`font-bold text-sm ${isProfit && amount > 0 ? 'text-emerald-500' : amount < 0 ? 'text-rose-500' : 'text-slate-100'} mb-0.5`}>
                      {amount < 0 ? '-' : ''}${Math.abs(amount).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 leading-tight">{trades} {trades === 1 ? 'trade' : 'trades'}</span>
                    <span className="text-[11px] text-slate-400 leading-tight">{winRate}% winrate</span>
                    <span className="text-[11px] text-slate-400 leading-tight">{rrr} RRR</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
