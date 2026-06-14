import React from 'react';
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/dashboard/settings-form';
import { redirect } from 'next/navigation';
import { Settings as SettingsIcon } from 'lucide-react';

export default async function SettingsPage() {
  try {
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

    let { data: profile, error } = await supabase
      .from('users')
      .select('subscription_tier, api_key, full_name, avatar_url, trial_ends_at, username, is_public, discord_webhook_url')
      .eq('id', user.id)
      .single();
      
    // Graceful fallback if the user hasn't run the SQL migration yet
    if (error) {
      const fallback = await supabase
        .from('users')
        .select('subscription_tier, api_key, full_name, avatar_url, trial_ends_at')
        .eq('id', user.id)
        .single();
      profile = fallback.data;
    }  
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
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') {
      throw err; // Allow Next.js redirects to bubble up
    }
    return (
      <div className="p-10 text-white bg-slate-900 h-screen font-mono">
        <h1 className="text-red-500 text-2xl font-bold mb-4">Server Render Error</h1>
        <p className="mb-4">Ett fel inträffade när sidan skulle laddas. Skicka en skärmdump på detta till utvecklaren:</p>
        <pre className="bg-black p-4 rounded text-sm text-red-400 whitespace-pre-wrap">
          {err.message}
          {'\n\n'}
          {err.stack}
        </pre>
      </div>
    );
  }
}
