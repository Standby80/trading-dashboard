'use client'

import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function LiveSyncIndicator({ currentAccount }: { currentAccount: string }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Vi kollar om det är ett MT5-konto (Live)
  const isLive = currentAccount.startsWith('MT5');

  if (!isLive) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh(); // Hämtar ny data från servern mjukt (utan page reload)
    
    // Visuell cooldown på snurran
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-md px-3 h-8 ml-2">
      <div className="flex items-center gap-1.5" title="Kopplad till MT5 via Live Sync">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-emerald-500 uppercase">Live</span>
      </div>
      
      <div className="w-[1px] h-3 bg-muted"></div>
      
      <button 
        onClick={handleRefresh}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors outline-none"
        title="Uppdatera data"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        <span className="hidden sm:inline-block">Update</span>
      </button>
    </div>
  );
}
