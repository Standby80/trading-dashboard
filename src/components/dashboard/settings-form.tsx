'use client';

import React, { useState, useRef } from 'react';
import { Key, Copy, RefreshCw, Check, User, Mail, Camera, AlertTriangle, Trash2, Share2, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function SettingsForm({ 
  initialApiKey, 
  initialName, 
  initialEmail, 
  initialAvatar 
}: { 
  initialApiKey: string;
  initialName?: string;
  initialEmail?: string;
  initialAvatar?: string;
  initialUsername?: string;
  initialIsPublic?: boolean;
  initialDiscordWebhookUrl?: string;
}) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [name, setName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar || '');
  const [username, setUsername] = useState(initialUsername || '');
  const [isPublic, setIsPublic] = useState(initialIsPublic || false);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState(initialDiscordWebhookUrl || '');

  // Loading states
  const [isRotating, setIsRotating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotate = async () => {
    if (!window.confirm("Are you sure? This will invalidate your current API key and you will need to update your MT5 EA with the new key.")) return;
    
    setIsRotating(true);
    try {
      const res = await fetch('/api/user/rotate-api-key', { method: 'POST' });
      const data = await res.json();
      if (data.api_key) {
        setApiKey(data.api_key);
      } else {
        alert(data.error || "Failed to rotate API key");
      }
    } catch (e) {
      alert("Error rotating API key");
    } finally {
      setIsRotating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      // Save directly to profile
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: publicUrl })
      });

    } catch (error: any) {
      alert("Error uploading avatar: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          full_name: name, 
          email,
          username: username || null,
          is_public: isPublic,
          discord_webhook_url: discordWebhookUrl || null
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated! If you changed your email, check your inbox for a confirmation link.");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (e) {
      alert("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("DANGER: Are you absolutely sure you want to delete your account? All your data, trades, and settings will be permanently erased. This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/profile', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/login';
      } else {
        alert(data.error || "Failed to delete account");
        setIsDeleting(false);
      }
    } catch (e) {
      alert("Error deleting account");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl pb-12">
      
      {/* Profile Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-indigo-400" />
          Profile Settings
        </h3>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-xs text-white font-medium">{isUploading ? 'Uploading...' : 'Change'}</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                className="bg-background"
              />
            </div>
            <Button 
              onClick={handleSaveProfile} 
              disabled={isSaving}
              className="mt-2"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* Social & Sharing Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
          <Share2 className="w-5 h-5 text-indigo-400" />
          Social & Sharing
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg">
            <div>
              <p className="font-medium text-white">Public Profile</p>
              <p className="text-sm text-muted-foreground">Allow others to view your dashboard via a public link.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Username (for public link)</label>
            <div className="flex items-center">
              <span className="bg-muted px-3 py-2 text-muted-foreground border border-r-0 border-border rounded-l-md text-sm">metametrics.com/u/</span>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} 
                placeholder="trader123" 
                className="bg-background rounded-l-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Discord Webhook URL
            </label>
            <Input 
              value={discordWebhookUrl} 
              onChange={(e) => setDiscordWebhookUrl(e.target.value)} 
              placeholder="https://discord.com/api/webhooks/..." 
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground mt-2">We'll automatically post a notification to your Discord server when a trade is closed.</p>
          </div>

          <Button 
            onClick={handleSaveProfile} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Social Settings'}
          </Button>
        </div>
      </div>

      {/* API Key Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-indigo-400" />
          MT5 Auto-Sync API Key
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          This key is used by the MetaMetricsSync EA to authenticate your live trades. Keep it secret!
        </p>

        <div className="flex items-center gap-3">
          <Input 
            value={apiKey} 
            readOnly 
            className="font-mono text-sm bg-background border-border"
          />
          <Button variant="secondary" onClick={handleCopy} className="shrink-0 w-24">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleRotate} 
            disabled={isRotating}
            className="shrink-0 w-24"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRotating ? 'animate-spin' : ''}`} />
            Rotate
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-rose-500/30 bg-rose-500/5 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
        <h3 className="text-xl font-bold text-rose-500 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleDeleteAccount} 
          disabled={isDeleting}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </Button>
      </div>

    </div>
  );
}
