'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Upload, 
  Activity, 
  LogOut, 
  LineChart, 
  Wallet,
  Crown,
  BookOpen,
  Menu
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ReportUploadForm } from "./report-upload-form";
import { ConnectLiveSyncButton } from "./connect-live-sync-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav({ userEmail, profile }: { userEmail?: string, profile?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Journal', icon: BookOpen, href: '/journal' },
    { name: 'Upload Report', icon: Upload, isAction: true, component: ReportUploadForm },
    { name: 'Live Sync', icon: Activity, isAction: true, component: ConnectLiveSyncButton },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 -ml-2 mr-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0 bg-sidebar border-r border-border flex flex-col">
        <SheetHeader className="p-6 text-left border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-3 text-foreground">
            <img src="/download/logo.jpg" alt="MetaMetrics Logo" className="w-10 h-10 object-contain rounded-full border border-white/10 shrink-0 shadow-lg" />
            <span className="font-bold text-lg tracking-tight">MetaMetrics</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.isAction && item.component) {
              const ActionComponent = item.component;
              return (
                <ActionComponent 
                  key={item.name} 
                  profile={profile}
                  trigger={
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  } 
                />
              );
            }

            return (
              <Link 
                key={item.name} 
                href={item.href!}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border shrink-0 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Theme</span>
            <ThemeToggle />
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30 overflow-hidden relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-indigo-400 font-bold text-sm">
                  {(profile?.full_name || userEmail || 'U').charAt(0).toUpperCase()}
                </span>
              )}
              {profile?.is_premium && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-yellow-950 p-0.5 rounded-full border border-yellow-200">
                  <Crown className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || 'Trader'}
              </span>
              <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
            </div>
          </div>

          <form action="/login/actions" method="POST">
             <button formAction={async () => {
                const { logout } = await import('@/app/login/actions');
                await logout();
             }} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors border border-transparent hover:border-rose-400/20">
               <LogOut className="w-4 h-4" />
               Sign Out
             </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
