import React from 'react';
import { redirect } from 'next/navigation';
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { getUserAccounts, getDashboardData } from "@/lib/data-service";
import { createClient } from '@/lib/supabase/server';
import { Plus } from "lucide-react";
import { AccountCard } from "@/components/dashboard/account-card";
import { ConnectLiveSyncButton } from "@/components/dashboard/connect-live-sync-button";

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
  let isPremium = false;
  let fullName = '';
  let avatarUrl = '';
  if (user) {
    const { data: profile } = await supabase.from('users').select('subscription_tier, full_name, avatar_url, trial_ends_at').eq('id', user.id).single();
    isPremium = profile?.subscription_tier === 'premium';
    fullName = profile?.full_name || '';
    avatarUrl = profile?.avatar_url || '';
    
    // Check Trial Expiration
    var trialEndsAt = profile?.trial_ends_at;
    if (!isPremium && trialEndsAt) {
      if (new Date(trialEndsAt).getTime() < new Date().getTime()) {
        redirect('/upgrade?expired=true');
      }
    }
  }

  const accountNames = await getUserAccounts();
  
  // Fetch high-level data for all accounts
  const accountsData = await Promise.all(
    accountNames.map(async (account, index) => {
      const data = await getDashboardData('all', undefined, account.id);
      
      const balance = data?.kpis?.currentBalance || 10000;
      const initial = data?.kpis?.initialBalance || 10000;
      // Withdrawals aren't explicitly tracked separately in kpis yet, so we mock or use 0
      const withdrawals = 0; 
      
      return {
        name: account.label,
        id: account.id,
        balance: balance,
        currency: 'USD',
        deposits: initial,
        withdrawals: withdrawals,
        colorIndex: index % COLORS.length
      };
    })
  );

  return (
    <div className="flex h-screen bg-background text-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className="hidden md:block">
        {/* @ts-ignore */}
        <AppSidebar userEmail={user?.email} profile={{ is_premium: isPremium, full_name: fullName, avatar_url: avatarUrl, trial_ends_at: trialEndsAt || null }} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <MobileNav userEmail={user?.email} profile={{ is_premium: isPremium, full_name: fullName, avatar_url: avatarUrl, trial_ends_at: trialEndsAt || null }} />
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Accounts</h1>
                <p className="text-white/80 text-lg mt-2 font-medium">Accounts Overview</p>
              </div>
            </div>
            
            <ConnectLiveSyncButton
              profile={{ subscription_tier: isPremium ? 'premium' : 'free', trial_ends_at: trialEndsAt }}
              trigger={
                <button className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors px-4 py-2.5 rounded-lg font-medium text-sm self-start sm:self-auto border border-indigo-500/30">
                  <Plus size={16} />
                  Add Account
                </button>
              }
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {accountsData.map((acc, i) => {
              const isEur = acc.name.toLowerCase().includes('ic markets'); // just mimicking the image dynamically
              const colorClass = COLORS[acc.colorIndex];

              return (
                <AccountCard 
                  key={acc.name} 
                  acc={acc} 
                  isEur={isEur} 
                  colorClass={colorClass} 
                />
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
