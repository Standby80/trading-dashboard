import Link from "next/link";
import { ArrowRight, ShieldCheck, Download, Puzzle, CheckCircle2, Zap, BarChart3, Clock, TrendingUp, Globe, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mini sparkline SVG component
function Sparkline({ color = "emerald", negative = false }: { color?: string; negative?: boolean }) {
  const paths: Record<string, string> = {
    emerald: "M0,30 C10,28 20,25 30,22 C40,19 50,18 60,14 C70,10 80,8 90,4 C95,2 98,1 100,0",
    red: "M0,5 C10,7 20,10 30,15 C40,20 50,22 60,25 C70,28 80,29 100,30",
    flat: "M0,15 C20,15 40,16 60,15 C80,14 90,15 100,15",
    rise: "M0,28 C15,26 25,22 40,18 C55,14 70,10 85,5 C92,3 96,1 100,0",
  };
  const fills: Record<string, string> = {
    emerald: "rgba(16,185,129,0.08)",
    red: "rgba(239,68,68,0.08)",
    flat: "rgba(255,255,255,0.04)",
    rise: "rgba(16,185,129,0.08)",
  };
  const strokes: Record<string, string> = {
    emerald: "#10b981",
    red: "#ef4444",
    flat: "rgba(255,255,255,0.2)",
    rise: "#10b981",
  };

  return (
    <svg viewBox="0 0 100 32" className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokes[color]} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokes[color]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={paths[color] + " L100,32 L0,32 Z"} fill={`url(#grad-${color})`} />
      <path d={paths[color]} fill="none" stroke={strokes[color]} strokeWidth="1.5" />
    </svg>
  );
}

const stats = [
  { label: "Account Value", value: "$10,622.62", color: "flat", textColor: "text-white" },
  { label: "Net P&L", value: "$622.62", color: "emerald", textColor: "text-emerald-400" },
  { label: "Win Rate", value: "42.86%", color: "rise", textColor: "text-emerald-400" },
  { label: "Profit Factor", value: "1.57", color: "emerald", textColor: "text-emerald-400" },
  { label: "Total Trades", value: "70", color: "flat", textColor: "text-white" },
  { label: "Average Win", value: "$57.32", color: "emerald", textColor: "text-emerald-400" },
  { label: "Average Loss", value: "-$27.43", color: "red", textColor: "text-rose-400" },
  { label: "Sharpe Ratio", value: "0.17", color: "rise", textColor: "text-emerald-400" },
  { label: "Max Drawdown", value: "1.95%", color: "red", textColor: "text-rose-400" },
  { label: "Total Commission", value: "-$142.50", color: "red", textColor: "text-rose-400" },
  { label: "Winning Trades", value: "30", color: "emerald", textColor: "text-emerald-400" },
  { label: "Losing Trades", value: "40", color: "red", textColor: "text-rose-400" },
  { label: "Best Trade", value: "$155.76", color: "emerald", textColor: "text-emerald-400" },
  { label: "Worst Trade", value: "-$59.78", color: "red", textColor: "text-rose-400" },
  { label: "Total Growth", value: "6.23%", color: "rise", textColor: "text-emerald-400" },
];

const days = [
  { day: "Mon", val: 0, neg: true },
  { day: "Tue", val: 92 },
  { day: "Wed", val: 50 },
  { day: "Thu", val: 12 },
  { day: "Fri", val: 76 },
  { day: "Sat", val: 0 },
  { day: "Sun", val: 0 },
];

const showcaseFeatures = [
  { id: "25KPI", filename: "25KPI.png", title: "25 Key Performance Indicators", desc: "Få stenkoll på varje detalj av din trading. Med över 25 nyckeltal (KPI:er) samlade på ett ställe kan du direkt identifiera dina styrkor och svagheter." },
  { id: "drawdown", filename: "Drawdown chart.png", title: "Drawdown Chart", desc: "Visualisera exakt hur djupa och långa dina förlustperioder (drawdowns) är. Agera snabbare när du närmar dig din smärtgräns." },
  { id: "expectancy", filename: "Expectancy Curve (Next 100 Trades).png", title: "Expectancy Curve (Next 100 Trades)", desc: "Se framtiden baserat på din nuvarande data. Vår expectancy-kurva simulerar hur ditt konto kommer utvecklas under dina nästa 100 affärer." },
  { id: "sync", filename: "MetaMetrics Live Sync API.png", title: "MetaMetrics Live Sync API", desc: "Inga fler manuella uppladdningar. Koppla vårt blixtsnabba Live Sync API till din plattform och få data i realtid." },
  { id: "monthly", filename: "Monthly and Symbol Performance.png", title: "Monthly and Symbol Performance", desc: "Vilken månad är din bästa? Vilket valutapar kostar dig pengar? Vår heatmap ger dig svaret omedelbart." },
  { id: "multi", filename: "Slide Multi account.png", title: "Multi Account Dashboard", desc: "Hantera och övervaka flera olika tradingkonton (t.ex. prop-firmor eller personliga) från exakt samma vy." },
  { id: "calender", filename: "Slide calender.png", title: "Performance Calendar", desc: "Dina vinster och förluster, elegant uppmålade i en kalendervy. Hitta mönster i dina handelsdagar." },
  { id: "time_day", filename: "Time Analytics Day.png", title: "Time Analytics Day", desc: "Är du en vinnare på måndagar men en förlorare på fredagar? Time Analytics visar exakt vilka veckodagar du bör undvika." },
  { id: "time_hour", filename: "Time Analytics Hour.png", title: "Time Analytics Hour", desc: "Optimera dina handelstider. Se svart på vitt exakt vilken timme på dygnet som ger dig störst edge på marknaden." },
  { id: "trade_exec", filename: "Trade Execution and Time Analytics.png", title: "Trade Execution and Time Analytics", desc: "Bryt ner dina exakta entry- och exit-tider för att förstå hur din timing påverkar dina resultat." },
  { id: "history", filename: "Trade history.png", title: "Full Trade History", desc: "Glöm gamla klumpiga listor. Vi ger dig din fullständiga handelshistorik vackert och överskådligt paketerad." },
  { id: "journal", filename: "Trading Day History and day journal.png", title: "Trading Day History and Day Journal", desc: "Din dagliga historik och journal på ett och samma ställe. Utvärdera dina känslor tillsammans med den kalla statistiken." },
  { id: "upload", filename: "Upload MT5 MT4 Report.png", title: "Upload MT5/MT4 Report", desc: "Vill du inte använda Live Sync? Inga problem. Ladda upp din MT4/MT5-rapport på 5 sekunder och få all data serverad." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
              <span className="text-indigo-400 font-bold text-xs">MM</span>
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

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-600/8 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium mb-8">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Real-time MT4 & MT5 sync — zero manual work
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            <span className="text-white">Stop guessing.</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
              Start knowing.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            MetaMetrics connects directly to MetaTrader 4 and MetaTrader 5 and turns your raw trade data into
            actionable insights — instantly. No spreadsheets. No guesswork. Just clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/signup">
              <Button size="lg" className="h-13 px-8 text-base bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl shadow-indigo-500/20 rounded-xl">
                Start for Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="h-13 px-8 text-base text-white/50 hover:text-white hover:bg-white/5 rounded-xl">
                Sign in →
              </Button>
            </Link>
          </div>

          {/* Showcase Hero Image */}
          <div className="mt-16 relative mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#161b22]/50 p-2 shadow-2xl backdrop-blur-sm overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
            <img 
              src="/images/showcase/Slide dashbord.png" 
              alt="MetaMetrics Dashboard" 
              className="w-full h-auto rounded-xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* ─── BALANCE CHART ───────────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Balance Curve</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
              Watch your account grow — trade by trade.
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-6">
              Every single closed position is plotted on your personal equity curve.
              Hover any point to see your exact balance on that date.
              Spot turning points, drawdown periods and winning streaks at a glance.
            </p>
            <ul className="space-y-3">
              {["Full history from day one, automatically", "Interactive hover tooltips per trade", "Instantly reveals your risk patterns"].map(f => (
                <li key={f} className="flex items-center gap-3 text-white/60 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>

          {/* Real Screenshot */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative rounded-2xl border border-white/10 bg-[#161b22] p-2 shadow-2xl">
              <img 
                src="/images/showcase/Drawdown chart.png" 
                alt="Account Growth Curve" 
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIME ANALYTICS ──────────────────────────────────── */}
      <section className="py-20 border-y border-white/5 bg-[#0a0e14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Chart mockup */}
            <div className="rounded-2xl border border-white/8 bg-[#161b22] p-6 shadow-2xl order-2 md:order-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold tracking-widest text-white/30">TIME ANALYTICS</p>
                </div>
                <div className="flex bg-white/5 rounded-lg p-0.5 text-xs">
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white font-semibold">Day</span>
                  <span className="px-3 py-1 text-white/30">Hour</span>
                </div>
              </div>
              <div className="flex items-end gap-2 h-36">
                {days.map(({ day, val, neg }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                      {val > 0 ? (
                        <div
                          className="w-full rounded-t-md bg-emerald-500/80"
                          style={{ height: `${val}%` }}
                        />
                      ) : neg ? (
                        <div className="w-full h-0.5 bg-rose-500/60 self-center" />
                      ) : (
                        <div className="w-full h-0 self-end" />
                      )}
                    </div>
                    <p className="text-white/30 text-[10px]">{day}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-white/20 text-[10px] mt-2 border-t border-white/5 pt-3">
                <span>$-85</span><span>$0</span><span>$85</span><span>$170</span><span>$255</span>
              </div>
            </div>

            {/* Copy */}
            <div className="order-1 md:order-2">
              <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Time Analytics</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                Are you trading on your worst days?
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-6">
                Most traders lose money on specific days or hours — without ever realizing it.
                MetaMetrics shows you exactly which times you perform, and which times you should stay out of the market.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-6 border-l-2 border-indigo-500/50 pl-4 italic">
                &ldquo;I discovered I was losing 80% of my money on Mondays. I just stopped trading Mondays. My PnL went up immediately.&rdquo;
              </p>
              <ul className="space-y-3">
                {["P&L breakdown by day of week", "Best and worst trading hours", "Avg profit per session — hour view"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/60 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 15 METRICS SECTION ─────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Dashboard Overview</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            15 key metrics. One dashboard. Zero spreadsheets.
          </h2>
          <p className="text-white/40 text-base max-w-2xl mx-auto">
            Every number your broker hides from you — surfaced instantly. Know your real performance, not just your last trade.
          </p>
        </div>

        {/* Large alternating showcase sections */}
        <div className="flex flex-col gap-24 mb-24 mt-16">
          {showcaseFeatures.map((feature, index) => (
            <div key={feature.id} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />
                <div className="relative rounded-2xl border border-white/10 bg-[#161b22] p-2 shadow-2xl overflow-hidden">
                  <img 
                    src={`/images/showcase/${feature.filename}`} 
                    alt={feature.title} 
                    className="w-full h-auto rounded-xl shadow-inner"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                  <span className="text-indigo-400 font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">{feature.title}</h3>
                <p className="text-white/50 text-lg leading-relaxed max-w-lg">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature callouts */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, color: "indigo", title: "Growth over time", desc: "Your balance curve shows exactly when you started winning — and when you gave it back." },
            { icon: BarChart3, color: "purple", title: "Win/Loss breakdown", desc: "Average win, average loss, best and worst trade. Know your edge before you put on the next position." },
            { icon: Zap, color: "emerald", title: "Risk metrics", desc: "Sharpe ratio, max drawdown, profit factor and expectancy — the stats professional traders live by." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-white/8 bg-[#0d1117] hover:border-white/15 transition-colors">
              <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
                color === "indigo" ? "bg-indigo-500/10 border border-indigo-500/20" :
                color === "purple" ? "bg-purple-500/10 border border-purple-500/20" :
                "bg-emerald-500/10 border border-emerald-500/20"
              }`}>
                <Icon className={`w-5 h-5 ${
                  color === "indigo" ? "text-indigo-400" :
                  color === "purple" ? "text-purple-400" :
                  "text-emerald-400"
                }`} />
              </div>
              <h3 className="text-white font-bold mb-1.5 text-base">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TWO WAYS TO IMPORT ──────────────────────────────── */}
      <section className="py-20 border-y border-white/5 bg-[#0a0e14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Two ways to connect</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sync your history in 60 seconds.
            </h2>
            <p className="text-white/40 text-base max-w-xl mx-auto">
              Whether you prefer real-time automation or a quick one-time upload — we&apos;ve got you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Live Sync */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-[#161b22] p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-bold">Live Sync EA</p>
                  <p className="text-indigo-400 text-xs">Automatic · Real-time</p>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Download our pre-compiled Expert Advisor, drop it onto your MT4 or MT5 chart, paste your API key — and your entire history syncs in seconds. New trades appear automatically as you close them.
              </p>

              {/* Modal mockup */}
              <div className="rounded-xl border border-white/8 bg-[#0d1117] p-5 text-sm flex-1">
                <p className="text-white font-bold mb-1 text-base">MetaMetrics Live Sync API</p>
                <p className="text-white/30 text-xs mb-4">Use your unique API key to connect your MT4/MT5 script with your dashboard.</p>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center">
                    <span className="text-white/20 text-sm tracking-wider">••••••••••••••••••••••••••</span>
                  </div>
                  <button className="px-3 py-2 bg-white/8 border border-white/10 rounded-lg text-white/50 text-xs font-semibold">Copy</button>
                </div>
                <div className="flex gap-4 justify-center mt-4">
                  {["Download", "Install", "Allow URL", "Activate"].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${i === 0 ? "border-indigo-500 bg-indigo-500/20" : "border-white/10 bg-white/5"}`}>
                        <span className="text-[8px] text-white/40">{i + 1}</span>
                      </div>
                      <span className={`text-[9px] ${i === 0 ? "text-white" : "text-white/30"}`}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HTML Upload */}
            <div className="rounded-2xl border border-white/8 bg-[#161b22] p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-bold">HTML Report Upload</p>
                  <p className="text-purple-400 text-xs">One-time · Instant</p>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Already have a trade history in MetaTrader? Export it as an HTML report (takes 10 seconds), upload it here, and your full history appears immediately. No EA required.
              </p>

              {/* Upload mockup */}
              <div className="rounded-xl border border-white/8 bg-[#0d1117] p-5 flex-1">
                <p className="text-white font-bold mb-1 text-base">Upload HTML Report</p>
                <p className="text-white/30 text-xs mb-4">Export your history as an HTML report from MetaTrader and upload it here.</p>
                <div className="mb-3">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Account Name</p>
                  <div className="bg-white/5 border border-indigo-500/30 rounded-lg px-3 py-2">
                    <span className="text-white/50 text-sm">Default</span>
                  </div>
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center text-center hover:border-white/20 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                    <FileUp className="w-5 h-5 text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm font-medium">Drag & drop your report here</p>
                  <p className="text-white/20 text-xs mt-1">or click to browse (.html)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Setup</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Up and running in 3 steps.</h2>
          <p className="text-white/40 text-base mb-14 max-w-xl mx-auto">
            No developer required. If you can drag a file, you can use MetaMetrics.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Download, step: "01", title: "Download the EA", desc: "Get the pre-compiled MetaMetricsSync.ex4 or .ex5 from your dashboard. No coding. No compilation." },
              { icon: Puzzle, step: "02", title: "Drop onto your chart", desc: "Open MetaTrader, drag the file onto any chart. The EA installs and loads your full history instantly." },
              { icon: ShieldCheck, step: "03", title: "Paste your API key", desc: "Copy your key from the dashboard, paste it in the EA Inputs tab. Your data is live." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="p-7 rounded-2xl border border-white/8 bg-[#161b22] text-left relative group hover:border-indigo-500/30 transition-colors">
                <div className="absolute top-5 right-5 text-5xl font-black text-white/3 select-none">{step}</div>
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5 bg-[#0a0e14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Simple, transparent pricing.</h2>
            <p className="text-white/40">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#161b22] flex flex-col hover:border-white/20 transition-colors">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Monthly</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-extrabold text-white">$9</span>
                <span className="text-white/30 text-base mb-1.5">/month</span>
              </div>
              <p className="text-white/25 text-sm mb-8">Billed monthly. Cancel anytime.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Automatic EA Live-Sync", "Full Trade History Import", "MetaMetrics Score", "Time & Risk Analytics", "Long/Short Split Analysis", "Performance Calendar", "15 Key Dashboard Metrics"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/55 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full h-12 font-semibold border-white/10 text-white hover:bg-white/5 hover:border-white/20 rounded-xl bg-transparent">
                  Get Started — $9/mo
                </Button>
              </Link>
            </div>

            {/* Yearly */}
            <div className="p-8 rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 to-[#161b22] flex flex-col relative shadow-2xl shadow-indigo-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wider whitespace-nowrap">
                BEST VALUE — SAVE 27%
              </div>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">Yearly</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-extrabold text-white">$79</span>
                <span className="text-white/30 text-base mb-1.5">/year</span>
              </div>
              <p className="text-white/30 text-sm mb-0.5">That&apos;s just <span className="text-indigo-400 font-semibold">$6.58/month</span>.</p>
              <p className="text-white/20 text-xs mb-8">Billed annually.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Automatic EA Live-Sync", "Full Trade History Import", "MetaMetrics Score", "Time & Risk Analytics", "Long/Short Split Analysis", "Performance Calendar", "15 Key Dashboard Metrics"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full h-12 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                  Get Started — $79/yr
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {[
              { q: "Do I need to import data manually?", a: "No. Our EA automatically fetches your full account history the moment you install it, and syncs new trades in real-time as they close. Alternatively you can upload an HTML report in seconds." },
              { q: "What if I already have years of trade history?", a: "No problem. The EA performs a full history scan on first load — every single trade, going back as far as your MetaTrader account has records." },
              { q: "Is my trading data secure?", a: "Yes. We use encrypted API keys and Supabase for secure storage. We never ask for your MetaTrader password or broker credentials." },
              { q: "Does it work on Mac and Windows?", a: "Yes. We provide both .ex4 and .ex5 files that work in all MetaTrader 4 and 5 terminals regardless of operating system." },
              { q: "Can I cancel my subscription?", a: "Absolutely. Cancel at any time from your account settings. No questions asked, no cancellation fees." },
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

      {/* ─── CTA BANNER ──────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-purple-950/20 p-12 text-center relative overflow-hidden">
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

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm">&copy; {new Date().getFullYear()} MetaMetrics. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
