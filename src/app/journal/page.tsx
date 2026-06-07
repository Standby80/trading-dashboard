import React from 'react';
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getDashboardData } from '@/lib/data-service';
import { JournalView } from '@/components/dashboard/journal-view';

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch full profile for sidebar
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_tier, full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const isPremium = profile?.subscription_tier === 'premium';
  const fullName = profile?.full_name || '';
  const avatarUrl = profile?.avatar_url || '';

  // Fetch all trades to filter out journal entries
  // We use the same service as dashboard to ensure accurate PnL calculations and consistent data
  const dashboardData = await getDashboardData(undefined, undefined, 'All Accounts');
  const allTrades = dashboardData?.rawTrades || [];

  // Filter trades that have either notes or screenshots
  const journaledTrades = allTrades.filter(
    (t: any) => (t.notes && t.notes.trim() !== '') || (t.screenshot_url && t.screenshot_url.trim() !== '')
  );

  return (
    <div className="flex h-screen bg-background text-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className="hidden md:block">
        <AppSidebar 
          userEmail={user.email} 
          profile={{ is_premium: isPremium, full_name: fullName, avatar_url: avatarUrl }} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background h-screen p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-6 shrink-0">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Trading Journal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Review your trade notes, screenshots, and lessons learned.</p>
        </div>

        {/* Journal App */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <JournalView trades={journaledTrades} />
        </div>

      </div>
    </div>
  );
}
