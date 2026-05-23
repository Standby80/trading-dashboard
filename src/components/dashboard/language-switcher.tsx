'use client'

import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const changeLanguage = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none hover:text-white text-slate-400 transition-colors flex items-center gap-1.5 text-xs font-medium px-2">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline-block">Language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 bg-[#131823] border border-white/10 text-slate-300">
        <DropdownMenuItem onClick={() => changeLanguage('sv')} className="hover:bg-[#1a2130] cursor-pointer">SV - Svenska</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="hover:bg-[#1a2130] cursor-pointer">EN - English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
