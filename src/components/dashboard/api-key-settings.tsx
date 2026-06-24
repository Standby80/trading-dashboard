"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, RefreshCw, Lock } from 'lucide-react';
import LiveSyncGuide from './live-sync-guide';

interface UserProfile {
  plan_level: 'FREE' | 'PREMIUM';
  api_key: string | null;
}

export default function ApiKeySettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${res.status}: Failed to load profile`);
        }
        const data = await res.json();
        
        // Map from database to the structure the component requires
        setProfile({
          plan_level: (data.plan_level === 'PREMIUM' || data.subscription_tier === 'premium') ? 'PREMIUM' : 'FREE',
          api_key: data.api_key || null,
          trial_ends_at: data.trial_ends_at || null
        });
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError(err.message || 'Could not load API settings.');
        
        // Set a fallback profile to unlock the UI instead of getting stuck in the loading screen
        setProfile({ plan_level: 'FREE', api_key: null, trial_ends_at: null });
      }
    }
    fetchProfile();
  }, []);

  const handleCopy = () => {
    if (!profile?.api_key) return;
    navigator.clipboard.writeText(profile.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotateKey = async () => {
    if (!confirm("Are you sure you want to generate a new API key? Your old MT5 script will stop syncing until you update the key there.")) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user/rotate-api-key', { method: 'POST' });
      const decoded = await res.json();
      if (res.ok) {
          setProfile(prev => prev ? { ...prev, api_key: decoded.newApiKey } : null);
      } else {
          setError(decoded.error || 'Failed to rotate key');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="text-zinc-400">Loading settings...</div>;

  const isPremium = profile.plan_level === 'PREMIUM';
  const isTrialActive = profile.trial_ends_at && new Date(profile.trial_ends_at).getTime() > new Date().getTime();
  const hasAccess = isPremium || isTrialActive;

  return (
    <div className="p-6 bg-card border border-border rounded-xl shadow-sm max-w-2xl">
      <h2 className="text-xl font-semibold text-foreground mb-2">MetaMetrics Live Sync API</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Use your unique API key to connect your MetaTrader 5 script with your dashboard for real-time syncing.
      </p>

      {!hasAccess ? (
        <div className="relative p-6 bg-muted/30 border border-dashed border-border rounded-lg overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10" />
          <div className="relative z-20 flex flex-col items-center">
            <div className="p-3 bg-indigo-600/10 rounded-full border border-indigo-500/20 mb-4">
              <Lock className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-foreground font-medium mb-1">Premium Feature</h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-4">
              Automatic Live Sync requires a Premium membership. For now, you can upload your reports manually via HTML.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition duration-200">
              Upgrade to Premium (50% Off)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your API Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground flex items-center justify-between overflow-hidden">
              <span className="truncate">
                {showKey ? profile.api_key : '••••••••••••••••••••••••••••••••'}
              </span>
              <button 
                onClick={() => setShowKey(!showKey)}
                className="text-muted-foreground hover:text-foreground ml-2 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button 
              onClick={handleCopy}
              className="px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg border border-border flex items-center gap-2 text-sm font-medium transition duration-150"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">
              Never share your API key. It grants direct access to input trades to your account.
            </span>
            <button 
              onClick={handleRotateKey}
              disabled={loading}
              className="text-xs flex items-center gap-1.5 text-red-400 hover:text-red-300 transition duration-150 font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Generate new key
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      )}

      {hasAccess && (
        <LiveSyncGuide />
      )}
    </div>
  );
}
