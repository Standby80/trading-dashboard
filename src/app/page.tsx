import Link from "next/link";
import { ArrowRight, ShieldCheck, Download, Puzzle, CheckCircle2, Zap, BarChart3, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
              <span className="text-indigo-400 font-bold text-sm">MM</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">MetaMetrics</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium mb-8">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Real-time MT5 sync — no manual imports
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            <span className="text-white">Know exactly where</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
              your money goes.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            MetaMetrics connects directly to MetaTrader 5 and turns your raw trade data into
            actionable insights — risk score, win streaks, time patterns and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-13 px-8 text-base bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl shadow-indigo-500/20 rounded-xl">
                Start for Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="h-13 px-8 text-base text-white/60 hover:text-white hover:bg-white/5 rounded-xl">
                Sign in →
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard screenshots grid */}
        <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Score card */}
          <div className="rounded-2xl border border-white/8 bg-[#161b22] overflow-hidden shadow-2xl p-6 text-left">
            <p className="text-xs font-bold tracking-widest text-white/30 mb-4">METAMETRICS SCORE</p>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/50 text-sm mb-1">MetaMetrics Score</p>
                <p className="text-5xl font-extrabold text-white">84.18</p>
              </div>
              {/* Radar placeholder */}
              <div className="w-28 h-28 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
                  <polygon points="50,10 85,35 73,80 27,80 15,35" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" />
                  <polygon points="50,22 72,40 64,68 36,68 28,40" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
                  <polygon points="50,34 62,46 56,62 44,62 38,46" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
                </svg>
              </div>
            </div>
            {/* Score bar */}
            <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-50% to-emerald-500 relative">
              <div className="absolute right-[12%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#161b22] shadow-md" />
            </div>
            <div className="flex justify-between text-white/30 text-xs mt-1">
              <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
            </div>
          </div>

          {/* Trade Execution card */}
          <div className="rounded-2xl border border-white/8 bg-[#161b22] overflow-hidden shadow-2xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full border border-indigo-500/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
              <p className="text-xs font-bold tracking-widest text-white/30">TRADE EXECUTION & ANALYTICS</p>
            </div>
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1">
                <p className="text-white/50 text-sm">Risk-to-Reward Ratio</p>
                <p className="text-white font-bold text-lg">1 : 2.09</p>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 w-[32%]" />
                <div className="bg-emerald-500 flex-1" />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-rose-400">Avg Loss -$27</span>
                <span className="text-emerald-400">Avg Win +$57</span>
              </div>
            </div>
            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between"><span className="text-white/50 text-sm">Average Duration</span><span className="text-white font-semibold">1h 6m</span></div>
              <div className="flex justify-between"><span className="text-white/50 text-sm">Avg Win Hold Time</span><span className="text-emerald-400 font-semibold">2h 2m</span></div>
              <div className="flex justify-between"><span className="text-white/50 text-sm">Avg Loss Hold Time</span><span className="text-rose-400 font-semibold">24m</span></div>
            </div>
          </div>

          {/* Long/Short split */}
          <div className="rounded-2xl border border-white/8 bg-[#161b22] overflow-hidden shadow-2xl p-6 text-left">
            <p className="text-xs font-bold tracking-widest text-white/30 mb-1">LONG & SHORT SPLIT</p>
            <p className="text-white/30 text-xs mb-4">Distribution and performance</p>
            <div className="flex items-center gap-6">
              {/* Donut */}
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#312e81" strokeWidth="3.2" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3.2"
                    strokeDasharray="53 47" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a855f7" strokeWidth="3.2"
                    strokeDasharray="47 53" strokeDashoffset="-53" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-indigo-400 font-bold text-xs">53%</span>
                  <span className="text-white/30 text-[10px]">L</span>
                  <span className="text-purple-400 font-bold text-xs">47%</span>
                  <span className="text-white/30 text-[10px]">S</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-sm">
                <div className="flex justify-between text-white/30 text-xs font-bold tracking-wider mb-1"><span>TOTAL TRADES</span><span className="text-white">70</span></div>
                <div className="border-t border-white/5 pt-2 grid grid-cols-2 gap-2">
                  <div><p className="text-white/30 text-xs">LONGS (37)</p><p className="text-white/50 text-xs">Wins <span className="text-emerald-400 font-bold">15</span></p><p className="text-white/50 text-xs">Losses <span className="text-rose-400 font-bold">22</span></p></div>
                  <div><p className="text-white/30 text-xs">SHORTS (33)</p><p className="text-white/50 text-xs">Wins <span className="text-emerald-400 font-bold">15</span></p><p className="text-white/50 text-xs">Losses <span className="text-rose-400 font-bold">18</span></p></div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly heatmap */}
          <div className="rounded-2xl border border-white/8 bg-[#161b22] overflow-hidden shadow-2xl p-6 text-left">
            <p className="text-xs font-bold tracking-widest text-white/30 mb-4">MONTHLY P&L HEATMAP</p>
            <div className="grid grid-cols-6 gap-1.5 mb-4">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].slice(0,6).map(m => (
                <p key={m} className="text-center text-white/30 text-[10px]">{m}</p>
              ))}
              <div className="rounded bg-white/5 h-8 flex items-center justify-center text-white/20 text-xs">–</div>
              <div className="rounded bg-white/5 h-8 flex items-center justify-center text-white/20 text-xs">–</div>
              <div className="rounded bg-white/5 h-8 flex items-center justify-center text-white/20 text-xs">–</div>
              <div className="rounded bg-rose-900/50 h-8 flex items-center justify-center text-rose-400 text-xs font-bold">-0.32%</div>
              <div className="rounded bg-emerald-900/60 h-8 flex items-center justify-center text-emerald-400 text-xs font-bold">6.55%</div>
              <div className="rounded bg-white/5 h-8 flex items-center justify-center text-white/20 text-xs">–</div>
            </div>
            <div className="border-t border-white/5 pt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div><p className="text-white/30 text-[10px] font-bold tracking-wider">BEST MONTH</p><p className="text-white font-semibold">May 2026</p><p className="text-emerald-400 font-bold">6.55%</p></div>
              <div><p className="text-white/30 text-[10px] font-bold tracking-wider">WORST</p><p className="text-white font-semibold">Apr 2026</p><p className="text-rose-400 font-bold">-0.32%</p></div>
              <div><p className="text-white/30 text-[10px] font-bold tracking-wider">AVG MONTH</p><p className="text-white font-semibold">3.11%</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-y border-white/5 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Up and running in 60 seconds.
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto mb-16">
            No CSV exports. No spreadsheets. Just plug in and your entire trade history appears automatically.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Download, step: "01", title: "Download the EA", desc: "Get the pre-compiled MetaMetricsSync.ex5 file from your dashboard. No coding needed." },
              { icon: Puzzle, step: "02", title: "Install in MT5", desc: "Drag the file directly onto your chart in MetaTrader 5. Takes 10 seconds." },
              { icon: ShieldCheck, step: "03", title: "Paste your API key", desc: "Copy your personal key from the dashboard, paste it in the EA Inputs tab — done!" },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="p-8 rounded-2xl border border-white/8 bg-[#161b22] text-left relative group hover:border-indigo-500/30 transition-colors duration-300">
                <div className="absolute top-6 right-6 text-4xl font-black text-white/4 select-none">{step}</div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Analytics</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Everything a serious trader needs.
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            From raw P&L to deep behavioral patterns — MetaMetrics surfaces insights your broker never shows you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, color: "indigo", title: "MetaMetrics Score", desc: "A single composite score weighing win rate, drawdown, consistency and more." },
            { icon: TrendingUp, color: "purple", title: "Long & Short Split", desc: "See exactly how your longs vs shorts perform across win rate and hold time." },
            { icon: Clock, color: "emerald", title: "Time Analytics", desc: "Discover your best hours and days to trade — and when to stay flat." },
            { icon: Zap, color: "rose", title: "Risk/Reward Ratio", desc: "Real avg win vs avg loss, automatically calculated across your full history." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-white/8 bg-[#161b22] hover:border-white/15 transition-colors duration-300">
              <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
                color === "indigo" ? "bg-indigo-500/10 border border-indigo-500/20" :
                color === "purple" ? "bg-purple-500/10 border border-purple-500/20" :
                color === "emerald" ? "bg-emerald-500/10 border border-emerald-500/20" :
                "bg-rose-500/10 border border-rose-500/20"
              }`}>
                <Icon className={`w-5 h-5 ${
                  color === "indigo" ? "text-indigo-400" :
                  color === "purple" ? "text-purple-400" :
                  color === "emerald" ? "text-emerald-400" :
                  "text-rose-400"
                }`} />
              </div>
              <h3 className="text-white font-bold mb-1.5 text-base">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 border-t border-white/5 bg-[#0a0e14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Simple, transparent pricing.
            </h2>
            <p className="text-white/40 text-lg">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#161b22] flex flex-col hover:border-white/20 transition-colors duration-300">
              <p className="text-white/40 text-sm font-semibold uppercase tracking-widest mb-4">Monthly</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-extrabold text-white">$9</span>
                <span className="text-white/40 text-base mb-1.5">/month</span>
              </div>
              <p className="text-white/30 text-sm mb-8">Billed monthly. Full access, cancel anytime.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Automatic EA Live-Sync", "Full Trade History Import", "MetaMetrics Score", "Time & Risk Analytics", "Long/Short Split Analysis", "Performance Calendar"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/60 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full h-12 text-base font-semibold border-white/10 text-white hover:bg-white/5 hover:border-white/20 rounded-xl bg-transparent">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Yearly — highlighted */}
            <div className="p-8 rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 to-[#161b22] flex flex-col relative shadow-2xl shadow-indigo-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wider">
                BEST VALUE — SAVE 27%
              </div>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Yearly</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-extrabold text-white">$79</span>
                <span className="text-white/40 text-base mb-1.5">/year</span>
              </div>
              <p className="text-white/30 text-sm mb-1">That&apos;s just <span className="text-indigo-400 font-semibold">$6.58/month</span>.</p>
              <p className="text-white/20 text-xs mb-8">Billed annually.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Automatic EA Live-Sync", "Full Trade History Import", "MetaMetrics Score", "Time & Risk Analytics", "Long/Short Split Analysis", "Performance Calendar"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                  Get Started — $79/yr
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {[
              { q: "Do I need to import data manually?", a: "No. Our EA automatically fetches your full account history the moment you install it, and syncs new trades in real-time as they close." },
              { q: "Is my trading data secure?", a: "Yes. We use encrypted API keys and secure storage via Supabase. We never ask for your MT5 password or broker credentials." },
              { q: "Does it work on Mac and Windows?", a: "Yes. The MetaMetricsSync.ex5 file works in all MetaTrader 5 terminals regardless of operating system." },
              { q: "Can I cancel my subscription?", a: "Absolutely. You can cancel at any time from your account settings. No questions asked." },
            ].map(({ q, a }) => (
              <AccordionItem key={q} value={q} className="border border-white/8 rounded-xl px-6 bg-[#161b22]">
                <AccordionTrigger className="text-base font-semibold text-white/80 hover:text-white py-5 hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-white/40 text-sm leading-relaxed pb-5">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-purple-950/30 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to trade smarter?
            </h2>
            <p className="text-white/40 text-lg mb-8">
              Join traders who use MetaMetrics to cut losing habits and compound their edge.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-13 px-10 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xl shadow-indigo-500/20">
                Start Free Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} MetaMetrics. All rights reserved.</p>
      </footer>
    </div>
  );
}
