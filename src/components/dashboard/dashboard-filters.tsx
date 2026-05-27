'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

export function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentPeriod = searchParams.get('period') || 'allTime';

  const handlePeriodChange = (period: string) => {
    const params = new URLSearchParams(searchParams);
    if (period === 'allTime') {
      params.delete('period');
    } else {
      params.set('period', period);
    }
    router.push(`/?${params.toString()}`);
  };

  const getPeriodLabel = () => {
    switch (currentPeriod) {
      case '7d': return '7 Days';
      case '30d': return '30 Days';
      case 'thisMonth': return 'This Month';
      default: return 'All Time';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 transition-colors outline-none">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          {getPeriodLabel()}
          <ChevronDown className="w-4 h-4 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card border border-border text-slate-300">
          <DropdownMenuItem onClick={() => handlePeriodChange('allTime')} className="hover:bg-muted cursor-pointer">
            All Time
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePeriodChange('thisMonth')} className="hover:bg-muted cursor-pointer">
            This Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePeriodChange('30d')} className="hover:bg-muted cursor-pointer">
            30 Days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePeriodChange('7d')} className="hover:bg-muted cursor-pointer">
            7 Days
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
