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
  UserCircle
} from 'lucide-react';

interface SidebarProps {
  userEmail?: string;
}

export function AppSidebar({ userEmail }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Upload Report', icon: Upload, href: '#' }, // These can be modals or other pages
    { name: 'Live Sync', icon: Activity, href: '#' },
    { name: 'Settings', icon: Settings, href: '#' },
  ];

  return (
    <div 
      className={`relative flex flex-col h-screen bg-[#0b0e14] border-r border-white/5 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-[#131823] border border-white/10 rounded-full p-1 text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center h-20 px-6 shrink-0 ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shrink-0">
          <LineChart className="w-5 h-5 text-indigo-400" />
        </div>
        {!isCollapsed && (
          <span className="text-white font-bold tracking-wide text-lg">MetaMetrics</span>
        )}
      </div>

      {/* User Profile */}
      <div className={`px-6 py-6 border-b border-white/5 shrink-0 flex flex-col ${isCollapsed ? 'items-center px-0' : 'items-center'}`}>
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 overflow-hidden mb-3">
          <UserCircle className="w-10 h-10 text-indigo-400/50" strokeWidth={1} />
        </div>
        {!isCollapsed && (
          <div className="text-center w-full overflow-hidden">
            <h3 className="text-slate-200 font-medium text-sm truncate w-full">Trader</h3>
            <p className="text-slate-500 text-xs truncate w-full mt-1">{userEmail || 'demo@user.com'}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Dashboard' && pathname === '/');
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center rounded-lg h-12 transition-all relative ${
                isActive 
                  ? 'bg-indigo-500/10 text-white' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
              )}
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 shrink-0">
        <button 
          onClick={async () => {
             const { createClient } = await import('@/lib/supabase/client');
             const supabase = createClient();
             await supabase.auth.signOut();
             window.location.href = '/login';
          }}
          className={`w-full flex items-center rounded-lg h-12 text-slate-400 hover:bg-white/5 hover:text-white transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}
