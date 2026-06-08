'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar as CalendarIcon, ChevronDown, Check, Coins } from "lucide-react";

export function DashboardFilters({ availableSymbols = [] }: { availableSymbols?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentPeriod = searchParams.get('period') || 'allTime';
  const currentSymbol = searchParams.get('symbols') || '';

  const [openSymbolPopover, setOpenSymbolPopover] = useState(false);

  const handlePeriodChange = (period: string) => {
    const params = new URLSearchParams(searchParams);
    if (period === 'allTime') {
      params.delete('period');
    } else {
      params.set('period', period);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSymbolChange = (symbol: string) => {
    const params = new URLSearchParams(searchParams);
    if (symbol === 'ALL' || symbol === currentSymbol) {
      params.delete('symbols');
    } else {
      params.set('symbols', symbol);
    }
    router.push(`/?${params.toString()}`);
    setOpenSymbolPopover(false);
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
      <Popover open={openSymbolPopover} onOpenChange={setOpenSymbolPopover}>
        <PopoverTrigger className="flex items-center gap-2 bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-md text-sm font-medium text-foreground transition-colors outline-none shrink-0 min-w-[140px] justify-between">
          <div className="flex items-center gap-2 truncate">
            <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{currentSymbol ? currentSymbol : 'All Symbols'}</span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-card border-border" align="end">
          <Command>
            <CommandInput placeholder="Search symbol..." className="h-9" />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No symbol found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => handleSymbolChange('ALL')}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${!currentSymbol ? "opacity-100" : "opacity-0"}`}
                  />
                  All Symbols
                </CommandItem>
                {availableSymbols.map((symbol) => (
                  <CommandItem
                    key={symbol}
                    onSelect={() => handleSymbolChange(symbol)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${currentSymbol === symbol ? "opacity-100" : "opacity-0"}`}
                    />
                    {symbol}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-md text-sm font-medium text-foreground transition-colors outline-none shrink-0">
          <CalendarIcon className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="whitespace-nowrap">{getPeriodLabel()}</span>
          <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card border border-border text-foreground">
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
