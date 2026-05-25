import React from 'react';
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { getUserAccounts, getDashboardData } from "@/lib/data-service";
import { createClient } from '@/lib/supabase/server';
import { Plus, MoreVertical, GripVertical, ChevronRight, GripHorizontal } from "lucide-react";

const COLORS = [
  'bg-gradient-to-br from-emerald-900 to-teal-950',
  'bg-gradient-to-br from-blue-900 to-slate-900',
  'bg-gradient-to-br from-amber-900 to-stone-900',
  'bg-gradient-to-br from-purple-900 to-fuchsia-950',
  'bg-gradient-to-br from-rose-900 to-red-950',
];

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const accountNames = await getUserAccounts();
  
  // Fetch high-level data for all accounts
  const accountsData = await Promise.all(
    accountNames.map(async (accName, index) => {
      const data = await getDashboardData('all', undefined, accName);
      
      const balance = data?.kpis?.currentBalance || 10000;
      const initial = data?.kpis?.initialBalance || 10000;
      // Withdrawals aren't explicitly tracked separately in kpis yet, so we mock or use 0
      const withdrawals = 0; 
      
      return {
        name: accName,
        balance: balance,
        currency: 'USD',
        deposits: initial,
        withdrawals: withdrawals,
        colorIndex: index % COLORS.length
      };
    })
  );

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val).replace('$', '€'); // Using EUR symbol as in image, or keep $ depending on preference. The image shows € for IC Markets and $ for others. We'll stick to $ standard for now.
  };

  const formatMoneyDynamic = (val: number, isEur: boolean) => {
    const symbol = isEur ? '€' : '$';
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(val));
    return `${val < 0 ? '-' : ''}${symbol}${formatted}`;
  };

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className="hidden md:block">
        <AppSidebar userEmail={user?.email} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#13151a]">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Accounts</h1>
              <p className="text-white/80 text-lg mt-2 font-medium">Accounts Overview</p>
            </div>
            
            <button className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors px-4 py-2.5 rounded-lg font-medium text-sm self-start sm:self-auto border border-indigo-500/30">
              <Plus size={16} />
              Add Account
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {accountsData.map((acc, i) => {
              const isEur = acc.name.toLowerCase().includes('ic markets'); // just mimicking the image dynamically
              const colorClass = COLORS[acc.colorIndex];

              return (
                <div key={acc.name} className="rounded-3xl overflow-hidden bg-[#1e2128] border border-white/5 shadow-2xl flex flex-col h-[240px] transition-transform hover:-translate-y-1 duration-300">
                  
                  {/* Top Half (Colored) */}
                  <div className={`flex-1 p-6 relative flex flex-col ${colorClass}`}>
                    {/* Decorative circles */}
                    <div className="absolute right-[-10%] top-[-10%] w-40 h-40 rounded-full border-[20px] border-white/5 pointer-events-none" />
                    
                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold text-xl italic tracking-tight">{acc.name}</h3>
                        <p className="text-white/60 text-xs mt-1 font-mono tracking-wider">#*********</p>
                      </div>
                      <div className="flex items-center gap-1 text-white/50 cursor-pointer hover:text-white transition-colors">
                        <div className="w-1 h-1 bg-current rounded-full" />
                        <div className="w-1 h-1 bg-current rounded-full" />
                        <div className="w-1 h-1 bg-current rounded-full" />
                      </div>
                    </div>
                    
                    {/* Balance */}
                    <div className="relative z-10 mt-3">
                      <div className="text-white text-3xl font-bold tracking-tight">
                        {formatMoneyDynamic(acc.balance, isEur)}
                      </div>
                    </div>
                    
                    {/* Bottom Stats */}
                    <div className="relative z-10 mt-auto flex justify-between items-end w-full">
                      <div className="text-white/80 text-xs font-bold">{isEur ? 'EUR' : 'USD'}</div>
                      <div className="flex gap-6 text-right">
                        <div>
                          <div className="text-white/60 text-[10px] uppercase font-bold mb-1 tracking-widest">Deposits</div>
                          <div className="text-emerald-400 text-sm font-bold tracking-wide">
                            {formatMoneyDynamic(acc.deposits, isEur)}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60 text-[10px] uppercase font-bold mb-1 tracking-widest">Withdrawals</div>
                          <div className="text-rose-400 text-sm font-bold tracking-wide">
                            {formatMoneyDynamic(acc.withdrawals, isEur)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Half (Footer) */}
                  <div className="bg-[#1e2128] px-6 py-5 flex justify-between items-center shrink-0 border-t border-white/5">
                    <div>
                      <div className="text-white/40 text-[10px] uppercase font-bold mb-1 tracking-widest">Sync Options</div>
                      <div className="text-white/70 text-sm font-medium">None</div>
                    </div>
                    <button className="text-white/50 text-xs font-bold hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                      Connect <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
