'use client';

import { LayoutGrid } from "lucide-react";

export function ResetLayoutButton() {
  const resetLayout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('metametrics-layout');
      window.location.reload();
    }
  };

  return (
    <button 
      onClick={resetLayout}
      title="Reset Layout"
      className="text-xs text-slate-400 hover:text-white bg-[#1e2330] hover:bg-[#2c3344] border border-white/5 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors"
    >
      <LayoutGrid className="w-3.5 h-3.5" />
      <span className="hidden sm:inline-block font-medium">Reset Layout</span>
    </button>
  );
}
