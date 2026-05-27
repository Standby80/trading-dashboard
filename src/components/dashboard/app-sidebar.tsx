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
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Wallet,
  Crown
} from 'lucide-react';

import { ReportUploadForm } from "./report-upload-form";
import { ConnectLiveSyncButton } from "./connect-live-sync-button";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarProps {
  userEmail?: string;
}

export function AppSidebar({ userEmail, profile }: SidebarProps & { profile?: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Upload Report', icon: Upload, isAction: true, component: ReportUploadForm },
    { name: 'Live Sync', icon: Activity, isAction: true, component: ConnectLiveSyncButton },
    { name: 'Settings', icon: Settings, href: '#' },
  ];

  return (
    <div 
      className={`relative flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-card border border-border rounded-full p-1 text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center h-20 px-6 shrink-0 ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
          <LineChart className="w-5 h-5 text-primary" />
        </div>
        {!isCollapsed && (
          <span className="text-foreground font-bold tracking-wide text-lg">MetaMetrics</span>
        )}
      </div>

      {/* User Profile */}
      <div className={`px-6 py-6 border-b border-border shrink-0 flex flex-col ${isCollapsed ? 'items-center px-0' : 'items-center'}`}>
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden mb-3">
          <UserCircle className="w-10 h-10 text-primary/50" strokeWidth={1} />
        </div>
        {!isCollapsed && (
          <div className="text-center w-full overflow-hidden flex flex-col items-center">
            <div className="flex items-center gap-2 justify-center w-full">
              <h3 className="text-foreground font-medium text-sm truncate">Trader</h3>
              {profile?.is_premium ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">PRO</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-500 border border-slate-500/30 shrink-0">FREE</span>
              )}
            </div>
            <p className="text-muted-foreground text-xs truncate w-full mt-1">{userEmail || 'demo@user.com'}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = !item.isAction && (pathname === item.href || (item.name === 'Dashboard' && pathname === '/'));
          
          const buttonClass = `flex items-center rounded-lg h-12 transition-all relative w-full ${
            isActive 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`;

          if (item.isAction && item.component) {
            const ActionComponent = item.component;
            return (
              <ActionComponent 
                key={item.name}
                profile={profile}
                trigger={
                  <button className={buttonClass}>
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                  </button>
                }
              />
            );
          }
          
          return (
            <Link 
              key={item.name} 
              href={item.href!}
              className={buttonClass}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border shrink-0 flex flex-col gap-2">
        {!profile?.is_premium && (
          <Link 
            href="/upgrade"
            className={`w-full flex items-center rounded-lg h-12 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            <Crown className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-semibold text-sm">Upgrade to Pro</span>}
          </Link>
        )}
        <ThemeToggle isCollapsed={isCollapsed} />
        <button 
          onClick={async () => {
             const { createClient } = await import('@/lib/supabase/client');
             const supabase = createClient();
             await supabase.auth.signOut();
             window.location.href = '/login';
          }}
          className={`w-full flex items-center rounded-lg h-12 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}
