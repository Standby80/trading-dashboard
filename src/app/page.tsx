import { KPICards } from "@/components/dashboard/kpi-cards";
import { TradingCalendar } from "@/components/dashboard/trading-calendar";
import { AnalyticsSidebar } from "@/components/dashboard/analytics-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCcw, Rocket } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-50 overflow-hidden font-sans">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0b0e14]">
          <div className="text-sm text-slate-400 flex items-center gap-4">
            <span>Last import: <span className="text-slate-200">Nov 19, 2024 09:01 AM</span></span>
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs font-medium transition-colors">
              Resync
            </button>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
            <Rocket className="w-4 h-4" />
            Start my day
          </button>
        </header>

        {/* Scrollable Dashboard */}
        <ScrollArea className="flex-1 px-4 sm:px-6 py-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Top KPI Cards */}
            <KPICards />

            {/* Main Grid: Calendar + Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              
              {/* Calendar Module */}
              <div className="lg:col-span-2 xl:col-span-3">
                <TradingCalendar />
              </div>

              {/* Analytics Sidebar */}
              <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                <AnalyticsSidebar />
              </div>

            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
