"use client";

import React, { useState } from 'react';
import { Download, FolderOpen, Globe, Play, CheckCircle } from 'lucide-react';

export default function LiveSyncGuide() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, name: 'Ladda ner', icon: Download },
    { id: 2, name: 'Installera', icon: FolderOpen },
    { id: 3, name: 'Tillåt URL', icon: Globe },
    { id: 4, name: 'Aktivera', icon: Play },
  ];

  return (
    <div className="mt-8 p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl max-w-2xl">
      <h3 className="text-lg font-medium text-white mb-4">Så här aktiverar du Live Sync i MT5</h3>
      
      {/* STEPPER HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 text-xs font-medium pb-2 border-b-2 transition duration-150 ${
                activeStep === step.id 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{step.name}</span>
            </button>
          );
        })}
      </div>

      {/* STEP CONTENT */}
      <div className="space-y-4 min-h-[160px] text-sm text-zinc-300">
        {activeStep === 1 && (
          <div className="space-y-3">
            <p>Börja med att ladda ner vårt specialbyggda synk-skript (Expert Advisor) till din dator.</p>
            <a 
              href="/api/download/mq5" 
              download="MetaMetricsSync.mq5"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-xs transition w-fit"
            >
              <Download className="w-4 h-4" /> Download MetaMetricsSync.mq5
            </a>
          </div>
        )}

        {activeStep === 2 && (
          <ul className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Öppna MetaTrader 5 på din dator.</li>
            <li>Klicka på <span className="text-white">Arkiv (File)</span> och välj <span className="text-white">Öppna datamapp (Open Data Folder)</span>.</li>
            <li>Navigera till mappen <span className="text-white">MQL5</span> och sedan till undermappen <span className="text-white">Experts</span>.</li>
            <li>Klistra in den nedladdade <span className="font-mono text-indigo-400">.mq5</span>-filen där.</li>
            <li>Högerklicka på "Expert Advisors" i din Navigator i MT5 och välj <span className="text-white">Uppdatera (Refresh)</span>.</li>
          </ul>
        )}

        {activeStep === 3 && (
          <div className="space-y-3">
            <p className="text-amber-400 text-xs font-medium bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
              ⚠️ VIKTIGT: Utan detta steg blockerar Windows MetaTrader från att skicka data till din dashboard!
            </p>
            <ul className="list-decimal list-inside space-y-2 text-zinc-400">
              <li>Gå till <span className="text-white">Verktyg (Tools)</span> -&gt; <span className="text-white">Inställningar (Options)</span>.</li>
              <li>Välj fliken <span className="text-white">Expert Advisors</span>.</li>
              <li>Kryssa i rutan <span className="text-white">"Tillåt WebRequest för listade URL:er"</span>.</li>
              <li>Lägg till följande adress: <span className="font-mono text-indigo-400">http://localhost:3000</span></li>
            </ul>
          </div>
        )}

        {activeStep === 4 && (
          <ul className="list-decimal list-inside space-y-2 text-zinc-400">
            <li>Dra ut <span className="text-white">MetaMetricsSync</span> från Navigator-fönstret till valfritt diagram.</li>
            <li>Under fliken <span className="text-white">Inputs</span>, dubbelklicka på <span className="text-white">InpApiKey</span> och klistra in din nyckel.</li>
            <li>Under fliken <span className="text-white">Common</span>, säkerställ att <span className="text-white">Allow Algo Trading</span> är ikryssat.</li>
            <li>Klicka på OK. Du är nu Live Synkad! 🚀</li>
          </ul>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
        <button 
          disabled={activeStep === 1}
          onClick={() => setActiveStep(prev => prev - 1)}
          className="text-xs font-medium text-zinc-400 hover:text-white disabled:opacity-30"
        >
          Föregående
        </button>
        <button 
          disabled={activeStep === 4}
          onClick={() => setActiveStep(prev => prev + 1)}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-30"
        >
          Nästa steg
        </button>
      </div>
    </div>
  );
}
