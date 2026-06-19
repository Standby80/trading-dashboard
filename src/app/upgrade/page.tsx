'use client';

import { Suspense } from 'react';
import { Check, ChevronLeft, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

function UpgradeContent() {
  const searchParams = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  return (
    <div className="min-h-screen bg-background text-slate-50 font-sans selection:bg-indigo-500/30 overflow-y-auto">
      {/* Navbar */}
      <header className="h-14 border-b border-border flex items-center px-6 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="text-center mb-12">
          {isExpired ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-rose-500/10 p-4 rounded-full">
                  <AlertTriangle className="w-10 h-10 text-rose-500" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">7-Day Free Trial</span> Has Expired</h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                Subscribe to a premium plan below to unlock your dashboard, journal, and resume live EA syncing.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Premium</span></h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                Unlock the full potential of MetaMetrics. Manage multiple accounts, sync live data, and get advanced analytics.
              </p>
            </>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Monthly</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-slate-500">/ month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-400 flex-1">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Account Connections</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Live Trading Sync</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Advanced Expectancy Curves</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Premium Support</li>
            </ul>
            <a 
              href="https://www.paypal.com/ncp/payment/ZXJ3WQK2WJJ3U"
              className="w-full bg-white/5 hover:bg-white/10 border border-border text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-auto"
            >
              Subscribe Monthly
            </a>
          </div>

          <div className="bg-gradient-to-b from-indigo-600/20 to-[#131823] border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-400/50 transition-colors flex flex-col">
            <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Save 17%
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Annually</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$89</span>
              <span className="text-indigo-200/70">/ year</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-indigo-100/80 flex-1">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> All Monthly Features</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Priority Feature Requests</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Lock in this price forever</li>
            </ul>
            <a 
              href="https://www.paypal.com/ncp/payment/CHN5QDV6D27D2"
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-auto"
            >
              Subscribe Annually
            </a>
          </div>
        </div>
        
        <div className="text-center flex items-center justify-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="w-4 h-4" />
          Payments securely processed by PayPal
        </div>
      </main>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>}>
      <UpgradeContent />
    </Suspense>
  );
}
