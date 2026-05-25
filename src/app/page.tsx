import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ReportUploadForm } from "@/components/dashboard/report-upload-form";
import { ConnectLiveSyncButton } from "@/components/dashboard/connect-live-sync-button";
import { ClearDataButton } from "@/components/dashboard/clear-data-button";
import { ResetLayoutButton } from "@/components/dashboard/reset-layout-button";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { AccountSwitcher } from "@/components/dashboard/account-switcher";
import { TemplateManager } from "@/components/dashboard/template-manager";
import { getDashboardData, getUserAccounts } from "@/lib/data-service";
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/login/actions';
import { LineChart, Menu, ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ period?: string, symbols?: string, account?: string }> 
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase.from('users').select('subscription_tier').eq('id', user.id).single();
    isPremium = profile?.subscription_tier === 'Premium';
  }

  const currentAccount = params?.account || 'Default';
  const accounts = await getUserAccounts();
  const data = await getDashboardData(params?.period, params?.symbols, currentAccount);
  const isConnected = !!data;

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar - Hidden on mobile, handled by AppSidebar component */}
      <div className="hidden md:block">
        <AppSidebar userEmail={user?.email} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 shrink-0 bg-[#0b0e14]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Account Switcher */}
            <AccountSwitcher accounts={accounts} currentAccount={currentAccount} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <TemplateManager />
            <DashboardFilters />
          </div>
        </header>

        {/* Scrollable Dashboard */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="w-full">
            <DashboardGrid data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
