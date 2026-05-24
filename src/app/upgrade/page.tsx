'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Copy, Check, Bitcoin, ArrowRight, ShieldCheck, Mail, CreditCard, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function UpgradePage() {
  const [userId, setUserId] = useState<string>('Loading...');
  const [copiedBTC, setCopiedBTC] = useState(false);
  const [copiedPaypal, setCopiedPaypal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        setUserId('Please login first');
      }
    };
    fetchUser();
  }, []);

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-50 font-sans selection:bg-indigo-500/30 overflow-y-auto">
      {/* Navbar */}
      <header className="h-14 border-b border-white/5 flex items-center px-6 sticky top-0 bg-[#0b0e14]/80 backdrop-blur-md z-50">
        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Premium</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Unlock the full potential of MetaMetrics. Manage multiple accounts, sync live data, and get advanced analytics.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="bg-[#131823] border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Monthly</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-slate-500">/ month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Account Connections</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Live Trading Sync</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Advanced Expectancy Curves</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Premium Support</li>
            </ul>
          </div>

          <div className="bg-gradient-to-b from-indigo-600/20 to-[#131823] border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-400/50 transition-colors">
            <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Save 8%
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Annually</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$99</span>
              <span className="text-indigo-200/70">/ year</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-indigo-100/80">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> All Monthly Features</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Priority Feature Requests</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Lock in this price forever</li>
            </ul>
          </div>
        </div>

        {/* Payment Process */}
        <div className="max-w-4xl mx-auto bg-[#131823] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-2xl font-semibold mb-2">How to Upgrade</h2>
            <p className="text-slate-400 text-sm">We are currently accepting manual payments via Crypto and PayPal to provide you with the lowest fees possible.</p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-12">
            
            {/* Step 1: Payment Methods */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">1</div>
                <h3 className="text-lg font-medium">Send Payment</h3>
              </div>

              <div className="space-y-6">
                {/* Bitcoin Option */}
                <div className="bg-[#0b0e14] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#F7931A]/20 rounded-lg flex items-center justify-center">
                      <Bitcoin className="w-6 h-6 text-[#F7931A]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">Bitcoin (BTC)</h4>
                      <p className="text-xs text-slate-500">Native SegWit Network</p>
                    </div>
                  </div>
                  <div className="bg-[#131823] border border-white/5 rounded-lg p-3 flex flex-col gap-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">BTC Address</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs text-slate-300 truncate font-mono">bc1q9ylmmq4ypd3tgwnfyvz0s99fdqypax92twu48k</code>
                      <button 
                        onClick={() => copyToClipboard('bc1q9ylmmq4ypd3tgwnfyvz0s99fdqypax92twu48k', setCopiedBTC)}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white shrink-0"
                      >
                        {copiedBTC ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* PayPal Option */}
                <div className="bg-[#0b0e14] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#00457C]/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#0079C1]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">PayPal</h4>
                      <p className="text-xs text-slate-500">Direct Transfer</p>
                    </div>
                  </div>
                  <div className="bg-[#131823] border border-white/5 rounded-lg p-3 flex flex-col gap-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">PayPal Email</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm text-slate-300 truncate font-mono">tabrizi.kambiz@gmail.com</code>
                      <button 
                        onClick={() => copyToClipboard('tabrizi.kambiz@gmail.com', setCopiedPaypal)}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white shrink-0"
                      >
                        {copiedPaypal ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Verification */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">2</div>
                <h3 className="text-lg font-medium">Verify & Activate</h3>
              </div>
              
              <div className="prose prose-invert prose-sm text-slate-400 mb-6">
                <p>
                  After sending your payment, you must email us so we can manually upgrade your account to Premium.
                </p>
              </div>

              <div className="bg-[#0b0e14] border border-white/10 rounded-xl p-5 mb-6">
                <p className="text-xs text-slate-400 mb-2">Your Unique User ID:</p>
                <div className="flex items-center justify-between gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                  <code className="text-sm text-indigo-300 truncate font-mono">{userId}</code>
                  <button 
                    onClick={() => copyToClipboard(userId, setCopiedId)}
                    className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-md transition-colors text-indigo-300 shrink-0"
                  >
                    {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-sm">
                <h4 className="flex items-center gap-2 text-emerald-400 font-medium mb-2">
                  <Mail className="w-4 h-4" /> Send us an email
                </h4>
                <p className="text-emerald-200/70 mb-3">
                  Email your <strong className="text-emerald-300">User ID</strong> and a <strong className="text-emerald-300">screenshot/receipt</strong> of your payment to:
                </p>
                <a href="mailto:tabrizi.kambiz@gmail.com" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-500/10 px-4 py-2 rounded-lg transition-colors">
                  tabrizi.kambiz@gmail.com
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="mt-6 flex items-start gap-3 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>Upgrades are processed manually and usually take less than 12 hours. Your subscription will start from the moment your account is activated.</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
