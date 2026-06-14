import React from 'react';
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/dashboard/settings-form';
import { redirect } from 'next/navigation';
import { Settings as SettingsIcon } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  let isPremium = false;
  let apiKey = '';
  let fullName = '';
  let avatarUrl = '';
  let username = '';
  let isPublic = false;
  let discordWebhookUrl = '';

  const { data: profile } = await supabase.from('users').select('subscription_tier, api_key, full_name, avatar_url, trial_ends_at, username, is_public, discord_webhook_url').eq('id', user.id).single();
  
  if (profile) {
    isPremium = profile.subscription_tier === 'premium';
    apiKey = profile.api_key;
    fullName = profile.full_name || '';
    avatarUrl = profile.avatar_url || '';
    username = profile.username || '';
    isPublic = profile.is_public || false;
    discordWebhookUrl = profile.discord_webhook_url || '';

    if (!isPremium && profile.trial_ends_at) {
      if (new Date(profile.trial_ends_at).getTime() < new Date().getTime()) {
        redirect('/upgrade?expired=true');
      }
    }
  }

  return (
    <div className="flex h-screen bg-background text-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className="hidden md:block">
        <AppSidebar userEmail={user.email} profile={{ is_premium: isPremium, full_name: fullName, avatar_url: avatarUrl, trial_ends_at: profile?.trial_ends_at || null }} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <MobileNav userEmail={user.email} profile={{ is_premium: isPremium, full_name: fullName, avatar_url: avatarUrl, trial_ends_at: profile?.trial_ends_at || null }} />
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  <SettingsIcon className="w-8 h-8 text-indigo-400" />
                  Settings
                </h1>
                <p className="text-white/80 text-lg mt-2 font-medium">Manage your account and integration keys</p>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <SettingsForm 
            initialApiKey={apiKey} 
            initialName={fullName} 
            initialEmail={user.email} 
            initialAvatar={avatarUrl} 
            initialUsername={username}
            initialIsPublic={isPublic}
            initialDiscordWebhookUrl={discordWebhookUrl}
          />

        </div>
      </div>
    </div>
  );
}
