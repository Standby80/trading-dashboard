import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ReportUploadForm } from "@/components/dashboard/report-upload-form";
import { ConnectLiveSyncButton } from "@/components/dashboard/connect-live-sync-button";
import { ClearDataButton } from "@/components/dashboard/clear-data-button";
import { ResetLayoutButton } from "@/components/dashboard/reset-layout-button";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { getDashboardData } from "@/lib/data-service";
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/login/actions';
import { LineChart } from "lucide-react";

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ period?: string, symbols?: string }> 
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const data = await getDashboardData(params?.period, params?.symbols);
  const isConnected = !!data;

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-50 overflow-hidden font-sans">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0b0e14]">
          <div className="text-sm text-slate-400 flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4 text-white font-bold tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <LineChart className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="hidden sm:inline-block">MetaMetrics</span>
            </div>
            <span>Status: <span className={isConnected ? "text-emerald-400" : "text-rose-400"}>
              {isConnected ? "Live Sync Active" : "Not Connected"}
            </span></span>
            {isConnected && (
              <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
                <span className="text-xs text-slate-400">
                  Server: <span className="text-white font-medium">MetaTrader 5</span>
                </span>
                <span className="text-xs text-slate-400">
                  Capital: <span className="text-white font-medium">${data?.kpis?.initialBalance?.toLocaleString() || '10,000'}</span>
                </span>
              </div>
            )}
            {isConnected && (
              <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs font-medium transition-colors ml-2">
                Resync
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 mr-2 hidden sm:inline-block">{user?.email}</span>
            <DashboardFilters />
            <ConnectLiveSyncButton profile={data?.profile} />
            <ReportUploadForm />
            <ResetLayoutButton />
            <ClearDataButton />
            <form action={logout}>
              <button type="submit" className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors">
                Logout
              </button>
            </form>
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
