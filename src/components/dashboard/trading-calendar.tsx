'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Percent, DollarSign } from "lucide-react";
import { DayDetailsModal } from './day-details-modal';

export function TradingCalendar({ data, availableSymbols = [], rawTrades = [] }: { data?: Record<string, { pnl: number, trades: number, wins: number, balanceAtStartOfDay?: number, grossProfit?: number, grossLoss?: number }>, availableSymbols?: string[], rawTrades?: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [displayMode, setDisplayMode] = useState<'$' | '%'>('$');
  
  // Modal State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayTrades, setDayTrades] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; 
  
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  const calendarDays = [];
  
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthDays = new Date(year, month, 0).getDate();
    calendarDays.push({ day: prevMonthDays - firstDayOfWeek + i + 1, isCurrentMonth: false, pnl: null, trades: 0, balanceAtStartOfDay: null });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = data?.[dateStr];
    calendarDays.push({
      day,
      dateStr,
      isCurrentMonth: true,
      pnl: dayData?.pnl !== undefined ? dayData.pnl : null,
      trades: dayData?.trades || 0,
      balanceAtStartOfDay: dayData?.balanceAtStartOfDay || null
    });
  }

  const totalSlots = Math.ceil(calendarDays.length / 7) * 7;
  let nextMonthDay = 1;
  for (let i = calendarDays.length; i < totalSlots; i++) {
    calendarDays.push({ day: nextMonthDay++, isCurrentMonth: false, pnl: null, trades: 0, balanceAtStartOfDay: null });
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-xl overflow-hidden p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Performance Calendar (P&L)</span>
        
        <div className="flex bg-background rounded p-1 border border-border">
           <button 
             onClick={() => setDisplayMode('$')}
             className={`flex items-center justify-center p-1 rounded transition-colors ${displayMode === '$' ? 'bg-muted text-emerald-400' : 'text-slate-500 hover:text-white'}`}
             title="Show in Dollars"
           >
             <DollarSign className="w-3.5 h-3.5" />
           </button>
           <button 
             onClick={() => setDisplayMode('%')}
             className={`flex items-center justify-center p-1 rounded transition-colors ${displayMode === '%' ? 'bg-muted text-emerald-400' : 'text-slate-500 hover:text-white'}`}
             title="Show in Percent"
           >
             <Percent className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-white min-w-[80px] text-center">
             {mounted ? `${monthName} ${year}` : '...'}
          </span>
          <button onClick={handleNextMonth} className="text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-8 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Week'].map(d => (
            <div key={d} className={`text-center text-xs font-medium ${d === 'Week' ? 'text-slate-500' : 'text-slate-400'} py-1`}>
              {d}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-8 gap-1">
           {weeks.map((week, wIdx) => {
             const weekPnl = week.reduce((sum, d) => sum + (d.pnl || 0), 0);
             const weekTrades = week.reduce((sum, d) => sum + (d.trades || 0), 0);
             
             // Find the first balance of the week to calculate weekly %
             const firstDayWithBalance = week.find(d => d.balanceAtStartOfDay !== null);
             const weekStartBalance = firstDayWithBalance ? firstDayWithBalance.balanceAtStartOfDay : null;
             
             const weekPercent = weekStartBalance ? (weekPnl / weekStartBalance) * 100 : 0;
             const weekDisplayVal = displayMode === '$' ? weekPnl : weekPercent;
             
             const isWeekWin = weekPnl >= 0;
             const isWeekLoss = weekPnl < 0;

             return (
               <div key={wIdx} className="contents">
                 {week.map((d, i) => {
                   const isWin = d.pnl !== null && d.pnl >= 0;
                   const isLoss = d.pnl !== null && d.pnl < 0;
                   const isBigWin = isWin && d.pnl !== null && d.pnl > 50;
                   
                   let bgClass = "bg-background";
                   if (isBigWin) bgClass = "bg-[#10b981]/20";
                   else if (isWin) bgClass = "bg-[#059669]/20";
                   else if (isLoss) bgClass = "bg-[#f43f5e]/20";
                   
                   const percent = (d.pnl !== null && d.balanceAtStartOfDay) ? (d.pnl / d.balanceAtStartOfDay) * 100 : 0;
                   const displayVal = displayMode === '$' ? d.pnl : percent;

                   return (
                     <div 
                        key={i} 
                        className={`flex flex-col items-center justify-center rounded-md ${bgClass} ${d.isCurrentMonth ? '' : 'opacity-30'} ${d.isCurrentMonth && d.trades > 0 ? 'cursor-pointer hover:brightness-125' : ''}`}
                        onClick={() => {
                          if (d.isCurrentMonth && d.trades > 0 && d.dateStr) {
                            const tradesForDay = rawTrades.filter(t => t.close_time.startsWith(d.dateStr));
                            setDayTrades(tradesForDay);
                            setSelectedDate(d.dateStr);
                          }
                        }}
                      >
                       <span className={`text-sm ${d.isCurrentMonth ? 'text-slate-200' : 'text-slate-600'}`}>{d.day}</span>
                       {d.pnl !== null && (
                         <span className={`text-xs font-bold ${isWin ? 'text-emerald-500' : 'text-rose-500'}`}>
                           {isWin ? '+' : '-'}{displayMode === '$' ? '$' : ''}{Math.abs(displayVal || 0).toFixed(2)}{displayMode === '%' ? '%' : ''}
                         </span>
                       )}
                       {d.trades > 0 && (
                         <span className="text-[10px] text-slate-400/80 mt-0.5">{d.trades} {d.trades === 1 ? 'trade' : 'trades'}</span>
                       )}
                     </div>
                   )
                 })}
                 
                 {/* Week Summary Cell */}
                 <div className="flex flex-col items-center justify-center rounded-md bg-muted/30 border-l border-border ml-1">
                   {weekTrades > 0 ? (
                     <>
                       <span className={`text-[13px] font-bold ${isWeekWin ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isWeekWin ? '+' : '-'}{displayMode === '$' ? '$' : ''}{Math.abs(weekDisplayVal).toFixed(displayMode === '$' ? 0 : 2)}{displayMode === '%' ? '%' : ''}
                       </span>
                       <span className="text-[10px] text-slate-400/80 mt-0.5">{weekTrades} trades</span>
                     </>
                   ) : (
                     <span className="text-[11px] text-slate-600">-</span>
                   )}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      <DayDetailsModal 
        isOpen={!!selectedDate} 
        onClose={() => setSelectedDate(null)} 
        date={selectedDate || ''} 
        trades={dayTrades} 
      />
    </div>
  );
}
