"use client";

import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ApiKeySettings from './api-key-settings';

export function ConnectLiveSyncButton({ profile, trigger }: { profile?: any, trigger?: React.ReactElement }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Note: ApiKeySettings component checks the backend for profile,
  // but we can use the passed down profile for the UI button lock icon.
  // Profile subscription_tier vs plan_level mapping depending on your DB schema
  const isPremium = profile?.subscription_tier === 'premium' || profile?.plan_level === 'PREMIUM';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={trigger || (
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            {isPremium ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            ) : (
              <Lock className="w-4 h-4 shrink-0" />
            )}
            Connect Live Sync
          </button>
        )}
      />
      
      <DialogContent className="sm:max-w-2xl bg-transparent border-none p-0 shadow-none">
        <ApiKeySettings />
      </DialogContent>
    </Dialog>
  );
}
