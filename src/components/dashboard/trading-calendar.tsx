import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Settings, Info, Calendar as CalendarIcon } from "lucide-react";

// Mock data to represent days in June 2024
const mockDays = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  if ([5, 10, 11, 14, 18, 19, 20, 21, 24, 25].includes(day)) {
    return { day, status: 'win', pnl: '+$' + (Math.random() * 1000 + 100).toFixed(0), trades: Math.floor(Math.random() * 5) + 1, winRate: '100.0%' };
  }
  if ([13, 17, 26].includes(day)) {
    return { day, status: 'loss', pnl: '-$' + (Math.random() * 500 + 50).toFixed(0), trades: Math.floor(Math.random() * 4) + 1, winRate: '0.0%' };
  }
  return { day, status: 'neutral', pnl: null, trades: 0, winRate: null };
});

export function TradingCalendar() {
  const weeks = [1, 2, 3, 4, 5, 6];

  return (
    <Card className="bg-[#131823] border-white/5 rounded-xl shadow-none h-full overflow-hidden flex flex-col">
      {/* Calendar Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <button className="p-1 hover:bg-white/5 rounded"><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-medium text-white px-2">June 2024</span>
            <button className="p-1 hover:bg-white/5 rounded"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-md text-sm font-medium border border-indigo-500/20">
            This month
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            Monthly stats: <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-medium border border-emerald-500/20">$5.13K</span>
            <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs font-medium border border-indigo-500/20">13 days</span>
          </div>
          <Settings className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <Info className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="flex flex-1 min-h-[500px]">
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
          <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-[#0b0e14] gap-[1px]">
             {/* Empty slots for May */}
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>

             {/* Days of June */}
             {mockDays.map((d) => (
               <div 
                  key={d.day} 
                  className={`relative p-2 flex flex-col items-end transition-colors ${
                    d.status === 'win' ? 'bg-[#103024] hover:bg-[#154232]' : 
                    d.status === 'loss' ? 'bg-[#3b1717] hover:bg-[#4d1d1d]' : 
                    'bg-[#131823] hover:bg-[#1a2130]'
                  }`}
                >
                 <span className="text-slate-500 text-xs font-medium">{d.day}</span>
                 {d.pnl && (
                   <div className="mt-auto w-full text-center flex flex-col items-center">
                     {d.day % 3 === 0 && <CalendarIcon className="w-3 h-3 text-white/50 absolute top-2 left-2" />}
                     <span className={`font-semibold text-sm ${d.status === 'win' ? 'text-emerald-400' : 'text-rose-400'}`}>
                       {d.pnl}
                     </span>
                     <span className="text-[10px] text-slate-300/70">{d.trades} {d.trades === 1 ? 'trade' : 'trades'}</span>
                     <span className="text-[10px] text-slate-300/50">{d.winRate}</span>
                   </div>
                 )}
               </div>
             ))}

             {/* Empty slots for July */}
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
             <div className="bg-[#131823]"></div>
          </div>
        </div>

        {/* Weekly Sidebar */}
        <div className="w-32 bg-[#131823] flex flex-col gap-[1px]">
          {/* Header align */}
          <div className="h-[33px] border-b border-white/5 bg-[#1a2130]"></div>
          
          <div className="flex-1 flex flex-col gap-[1px] bg-[#0b0e14]">
            {weeks.map((w, i) => {
              const amounts = ['$0', '$1.05K', '$1.61K', '$1.98K', '$488', '$0'];
              const days = [0, 1, 4, 5, 3, 0];
              const isProfit = amounts[i] !== '$0';
              return (
                <div key={w} className="flex-1 bg-[#131823] flex flex-col justify-center items-center">
                  <span className="text-xs text-slate-400 mb-1">Week {w}</span>
                  <span className={`font-semibold text-sm ${isProfit ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {amounts[i]}
                  </span>
                  <span className={`text-[10px] font-medium mt-1 ${isProfit ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {days[i]} {days[i] === 1 ? 'day' : 'days'}
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
