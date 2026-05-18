'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Settings, Info, Calendar as CalendarIcon } from "lucide-react";

export function TradingCalendar({ data }: { data?: Record<string, { pnl: number, trades: number, wins: number }> }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon
  
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

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = data?.[dateStr];
    
    if (dayData) {
      monthlyPnl += dayData.pnl;
      activeDays++;
      const weekIndex = Math.floor((firstDayOfWeek + day - 1) / 7);
      weeklyTotals[weekIndex] += dayData.pnl;
      weeklyActiveDays[weekIndex]++;
      
      calendarDays.push({
        day,
        status: dayData.pnl >= 0 ? 'win' : 'loss',
        pnl: dayData.pnl,
        trades: dayData.trades,
        winRate: dayData.trades > 0 ? ((dayData.wins / dayData.trades) * 100).toFixed(1) + '%' : '0%'
      });
    } else {
      calendarDays.push({ day, status: 'neutral', pnl: null, trades: 0, winRate: null });
    }
  }

  // Padding for end of month to make 5 or 6 full rows
  const totalSlots = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  for (let i = calendarDays.length; i < totalSlots; i++) {
    calendarDays.push(null);
  }

  const weeksCount = totalSlots / 7;

  return (
    <Card className="bg-[#131823] border-white/5 rounded-xl shadow-none h-full overflow-hidden flex flex-col">
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
          <Settings className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <Info className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="flex flex-1 h-full min-h-0">
        {/* Main Grid */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          {/* Days of week */}
          <div className="grid grid-cols-7 border-b border-white/5 bg-[#1a2130]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
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
                    className={`relative p-2 flex flex-col items-end transition-colors ${
                      d.status === 'win' ? 'bg-[#103024] hover:bg-[#154232]' : 
                      d.status === 'loss' ? 'bg-[#3b1717] hover:bg-[#4d1d1d]' : 
                      'bg-[#131823] hover:bg-[#1a2130]'
                    }`}
                  >
                   <span className="text-slate-500 text-xs font-medium">{d.day}</span>
                   {d.pnl !== null && (
                     <div className="mt-auto w-full text-center flex flex-col items-center">
                       <span className={`font-semibold text-sm ${d.status === 'win' ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {d.pnl >= 0 ? '+' : '-'}${Math.abs(d.pnl).toFixed(0)}
                       </span>
                       <span className="text-[10px] text-slate-300/70">{d.trades} {d.trades === 1 ? 'trade' : 'trades'}</span>
                       <span className="text-[10px] text-slate-300/50">{d.winRate}</span>
                     </div>
                   )}
                 </div>
               )
             })}
          </div>
        </div>

        {/* Weekly Sidebar */}
        <div className="w-32 bg-[#131823] flex flex-col gap-[1px]">
          <div className="h-[33px] border-b border-white/5 bg-[#1a2130]"></div>
          
          <div className="flex-1 flex flex-col gap-[1px] bg-[#0b0e14]">
            {Array.from({ length: weeksCount }).map((_, i) => {
              const amount = weeklyTotals[i];
              const days = weeklyActiveDays[i];
              const isProfit = amount >= 0;
              return (
                <div key={i} className="flex-1 bg-[#131823] flex flex-col justify-center items-center">
                  <span className="text-xs text-slate-400 mb-1">Week {i + 1}</span>
                  <span className={`font-semibold text-sm ${isProfit && amount > 0 ? 'text-emerald-400' : amount < 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                    ${Math.abs(amount).toFixed(0)}
                  </span>
                  <span className={`text-[10px] font-medium mt-1 ${days > 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
