import Link from "next/link";
import { ArrowRight, ShieldCheck, Download, Puzzle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary font-bold text-xl leading-none">M</span>
            </div>
            <span className="font-bold text-lg tracking-tight">MetaMetrics</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          New: Automatic EA Sync for MT5
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Take control of your trading with MetaMetrics.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Seamless real-time sync from MetaTrader 5 straight to your personal dashboard. Analyze your history and become a more profitable trader today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full sm:w-auto shadow-xl shadow-primary/20">
              Start Syncing for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        {/* Placeholder for Dashboard Mockup */}
        <div className="mt-20 relative rounded-2xl border border-border bg-card p-2 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-emerald-500/5"></div>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            [Placeholder for Dashboard Screenshot]
          </p>
        </div>
      </section>

      {/* Zero-Effort Feature */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Your entire trading career – in 60 seconds.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
            Forget manual CSV exports and messy Excel sheets. When you launch MetaMetrics, our EA automatically scans your entire account history via <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">HistorySelect</code>.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-border bg-background text-left shadow-sm">
              <Download className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">1. Download</h3>
              <p className="text-muted-foreground">Get the ready-to-use binary file <span className="font-semibold text-foreground">MetaMetricsSync.ex5</span> from your dashboard.</p>
            </div>
            <div className="p-8 rounded-2xl border border-border bg-background text-left shadow-sm relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <Puzzle className="w-10 h-10 text-primary mb-4 relative z-10" />
              <h3 className="text-xl font-bold mb-2 relative z-10">2. Install</h3>
              <p className="text-muted-foreground relative z-10">Drag the file directly onto your chart in MetaTrader 5. No compilation required.</p>
            </div>
            <div className="p-8 rounded-2xl border border-border bg-background text-left shadow-sm">
              <ShieldCheck className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">3. Connect</h3>
              <p className="text-muted-foreground">Copy your personal API key and paste it into the &apos;Inputs&apos; tab. Done!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Module */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple and transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that best fits your trading.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-border bg-card flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-extrabold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Manual CSV Upload</li>
              <li className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Basic Analytics</li>
              <li className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 1 Connected Account</li>
            </ul>
            <Link href="/signup">
              <Button variant="outline" className="w-full h-12 text-base font-semibold border-border">Create Free Account</Button>
            </Link>
          </div>
          
          {/* Premium Tier */}
          <div className="p-8 rounded-2xl border-2 border-primary bg-card relative flex flex-col shadow-xl shadow-primary/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide">
              RECOMMENDED
            </div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">Premium</h3>
            <div className="text-4xl font-extrabold mb-6">$19<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-foreground font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Automatic EA Live-Sync</li>
              <li className="flex items-center gap-3 text-foreground font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Zero-Effort History Fetch</li>
              <li className="flex items-center gap-3 text-foreground font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Unlimited Accounts</li>
              <li className="flex items-center gap-3 text-foreground font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Advanced Time & Risk Analytics</li>
            </ul>
            <Link href="/signup">
              <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">Do I need to import data manually?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                No, with Premium our EA handles everything. It fetches both your historical trades and syncs new trades in real-time, completely automatically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">Is my data secure?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Yes, we use encrypted API keys and secure data storage via Supabase. We never ask for your MetaTrader passwords or broker login details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">Does it work on Mac and Windows?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Yes, our .ex5 EA works flawlessly in all MetaTrader 5 terminals regardless of your operating system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MetaMetrics. All rights reserved.</p>
      </footer>
    </div>
  );
}
