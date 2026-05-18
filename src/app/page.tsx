import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ReportUploadForm } from "@/components/dashboard/report-upload-form";
import { ClearDataButton } from "@/components/dashboard/clear-data-button";
import { getDashboardData } from "@/lib/data-service";
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/login/actions';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const data = await getDashboardData();
  const isConnected = !!data;

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-50 overflow-hidden font-sans">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0b0e14]">
          <div className="text-sm text-slate-400 flex items-center gap-4">
            <span>Status: <span className={isConnected ? "text-emerald-400" : "text-rose-400"}>
              {isConnected ? "Live Sync Active" : "Not Connected"}
            </span></span>
            {isConnected && (
              <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs font-medium transition-colors">
                Resync
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 mr-2 hidden sm:inline-block">{user?.email}</span>
            <ReportUploadForm />
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
