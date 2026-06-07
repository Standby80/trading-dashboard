'use client';

import React, { useState } from 'react';
import { Key, Copy, RefreshCw, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SettingsForm({ initialApiKey }: { initialApiKey: string }) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isRotating, setIsRotating] = useState(false);
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

  return (
    <div className="space-y-8 max-w-2xl">
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
    </div>
  );
}
