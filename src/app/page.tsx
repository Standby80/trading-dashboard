import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ReportUploadForm } from "@/components/dashboard/report-upload-form";
import { ConnectLiveSyncButton } from "@/components/dashboard/connect-live-sync-button";
import { ClearDataButton } from "@/components/dashboard/clear-data-button";
import { ResetLayoutButton } from "@/components/dashboard/reset-layout-button";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { AccountSwitcher } from "@/components/dashboard/account-switcher";
import { getDashboardData, getUserAccounts } from "@/lib/data-service";
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/login/actions';
import { LineChart, Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 shrink-0 bg-[#0b0e14]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2 sm:mr-4 text-white font-bold tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shrink-0">
                <LineChart className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="hidden sm:inline-block">MetaMetrics</span>
            </div>
            
            {/* Account Switcher - Visible on all screens */}
            <AccountSwitcher accounts={accounts} currentAccount={currentAccount} />
            
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <span className="ml-2">Status: <span className={isConnected ? "text-emerald-400" : "text-rose-400"}>
                {isConnected ? "Live Sync Active" : "Not Connected"}
              </span></span>
              {isConnected && (
                <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs font-medium transition-colors ml-2">
                  Resync
                </button>
              )}
            </div>
          </div>



          {/* Actions (Hamburger Menu on all screens) */}
          <div className="flex items-center gap-2">
            <DashboardFilters />
            
            <Sheet>
              <SheetTrigger className="p-2 text-slate-400 hover:text-white transition-colors">
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0b0e14] border-l border-white/5 text-slate-200">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-slate-200">Menu</SheetTitle>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </SheetHeader>
                
                <div className="flex flex-col gap-4">
                  {!isPremium && (
                    <Link href="/upgrade" className="w-full text-center text-sm font-medium bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Upgrade to Premium
                    </Link>
                  )}
                  <ConnectLiveSyncButton profile={data?.profile} />
                  <ReportUploadForm />
                  <div className="h-px bg-white/5 my-2" />
                  <ResetLayoutButton />
                  <ClearDataButton />
                  <div className="h-px bg-white/5 my-2" />
                  <form action={logout}>
                    <button type="submit" className="w-full text-left text-sm text-slate-400 hover:text-white transition-colors">
                      Logout
                    </button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
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
