'use client';

import { LayoutGrid } from "lucide-react";

export function ResetLayoutButton() {
  const resetLayout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('metametrics-layout');
      localStorage.removeItem('metametrics-layout-v2');
      window.location.reload();
    }
  };

  return (
    <button 
      onClick={resetLayout}
      className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-foreground hover:bg-white/5 transition-colors"
    >
      <LayoutGrid className="w-4 h-4 shrink-0" />
      Reset Layout
    </button>
  );
}
