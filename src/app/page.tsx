import { KPICards } from "@/components/dashboard/kpi-cards";
import { TradingCalendar } from "@/components/dashboard/trading-calendar";
import { AnalyticsSidebar } from "@/components/dashboard/analytics-sidebar";
import { MT5ConnectForm } from "@/components/dashboard/mt5-connect-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCcw, Rocket } from "lucide-react";
import { getDashboardData } from "@/lib/data-service";

export default async function DashboardPage() {
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
            {!isConnected && <MT5ConnectForm />}
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
              <Rocket className="w-4 h-4" />
              Start my day
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard */}
        <ScrollArea className="flex-1 px-4 sm:px-6 py-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Top KPI Cards */}
            <KPICards data={data?.kpis} />

            {/* Main Grid: Calendar + Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              
              {/* Calendar Module */}
              <div className="lg:col-span-2 xl:col-span-3">
                <TradingCalendar data={data?.dailyData} />
              </div>

              {/* Analytics Sidebar */}
              <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                <AnalyticsSidebar cumulativeData={data?.cumulativeData} kpis={data?.kpis} />
              </div>

            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
