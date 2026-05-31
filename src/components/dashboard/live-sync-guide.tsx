"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Download, FolderOpen, Globe, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LiveSyncGuide() {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, name: 'Download', icon: Download },
    { id: 2, name: 'Install', icon: FolderOpen },
    { id: 3, name: 'Allow URL', icon: Globe },
    { id: 4, name: 'Activate', icon: Play },
  ];

  return (
    <Card className="bg-background border-border">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-foreground mb-4">How to enable Live Sync in MT5</h3>
          
          <div className="flex items-center justify-between relative mb-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-muted -z-10"></div>
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step >= s.id 
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' 
                    : 'border-border bg-card text-slate-500'
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${step >= s.id ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[160px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-sm text-foreground">
                Start by downloading our custom sync script (Expert Advisor) to your computer.
              </p>
              <a href="/api/download/ex5" download>
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Download className="w-4 h-4" />
                  Download MetaMetricsSync.ex5
                </Button>
              </a>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                <li>Open MetaTrader 5 on your computer.</li>
                <li>Click on <span className="text-foreground">File</span> and select <span className="text-foreground">Open Data Folder</span>.</li>
                <li>Navigate to <span className="font-mono text-indigo-400">MQL5 \ Experts</span>.</li>
                <li>Paste the downloaded <span className="font-mono text-indigo-400">.ex5</span> file there.</li>
                <li>Right-click "Expert Advisors" in your Navigator in MT5 and select <span className="text-foreground">Refresh</span>.</li>
              </ol>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm mb-4">
                ⚠️ IMPORTANT: Without this step, Windows blocks MetaTrader from sending data to your dashboard!
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Go to <span className="text-foreground">Tools</span> -&gt; <span className="text-foreground">Options</span>.</li>
                <li>Select the <span className="text-foreground">Expert Advisors</span> tab.</li>
                <li>Check the box <span className="text-foreground">"Allow WebRequest for listed URL"</span>.</li>
                <li>Add the following address: <span className="font-mono text-indigo-400">https://metametrics.app</span></li>
              </ol>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                <li>Drag <span className="text-foreground">MetaMetricsSync</span> from the Navigator window to any chart.</li>
                <li>Under the <span className="text-foreground">Inputs</span> tab, double-click <span className="text-foreground">InpApiKey</span> and paste your key.</li>
                <li>Under the <span className="text-foreground">Common</span> tab, ensure <span className="text-foreground">Allow Algo Trading</span> is checked.</li>
                <li>Click OK. You are now Live Synced! 🚀</li>
              </ol>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 mt-2 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={() => setStep(Math.min(4, step + 1))}
            disabled={step === 4}
            className="bg-card hover:bg-muted text-indigo-400 border border-border"
          >
            Next Step
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
