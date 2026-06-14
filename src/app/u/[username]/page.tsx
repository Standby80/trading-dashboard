import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { getDashboardData } from "@/lib/data-service";
import { LineChart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: 'Public Trading Dashboard | MetaMetrics',
  description: 'Verified trading results powered by MetaMetrics.',
}

export default async function PublicProfilePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ username: string }>,
  searchParams: Promise<{ period?: string, symbols?: string }> 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Fetch data as public user
  const data = await getDashboardData(
    resolvedSearchParams?.period, 
    resolvedSearchParams?.symbols, 
    'All Accounts', 
    resolvedParams.username
  );

  if (!data) {
    notFound();
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="min-h-[4.5rem] sm:h-20 py-3 sm:py-0 border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
              <LineChart className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {data.profile?.full_name || resolvedParams.username}'s Dashboard
                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">Verified</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Powered by MetaMetrics
            </Link>
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
