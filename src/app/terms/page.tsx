import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Terms of Service | MetaMetrics',
  description: 'Terms of Service for MetaMetrics Trading Analytics',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-16 px-4 sm:px-6">
      <div className="max-w-3xl w-full">
        <div className="mb-10">
          <Link href="/">
            <Button variant="ghost" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <p>
            Welcome to MetaMetrics. These Terms of Service ("Terms") govern your access to and use of the MetaMetrics platform, website, and associated Expert Advisor (EA) software. By accessing or using our service, you agree to be bound by these Terms.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms & Service Description</h2>
            <p>MetaMetrics provides an advanced trading analytics and journaling dashboard designed to synchronize with MetaTrader 4 (MT4) and MetaTrader 5 (MT5) platforms. Our service is designed to help traders analyze their performance through mathematical edge calculation and automated data visualization. By creating an account, you acknowledge that you have read, understood, and agree to these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Data Privacy & Security Commitment</h2>
            <p>Trust is the foundation of our platform. We employ bank-grade encryption to protect your data. MetaMetrics operates on a strict "Read-Only" basis regarding your trading accounts. We will <em>never</em> ask for, nor store, your broker login credentials or passwords. The API key generated in your dashboard is solely used to authenticate the secure transmission of trade history from your MT4/MT5 terminal to our encrypted servers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration & Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your MetaMetrics account login information and your unique API key. You agree to notify us immediately of any unauthorized use of your account. MetaMetrics cannot and will not be liable for any loss or damage arising from your failure to protect your login credentials.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property & Software License</h2>
            <p>When you subscribe to our service, we grant you a personal, non-exclusive, non-transferable license to use the MetaMetrics dashboard and our proprietary Expert Advisor (.ex4 / .ex5 files). You agree not to copy, modify, distribute, sell, or reverse-engineer any part of our software, APIs, or source code.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Subscriptions, Trials, and Cancellations</h2>
            <p>We offer a 7-day free trial so you can experience the full power of MetaMetrics before committing. If you choose to upgrade to a premium subscription, you will be billed automatically according to your chosen billing cycle (monthly or annually). You can cancel your subscription at any time through your dashboard settings. Upon cancellation, you will retain access to premium features until the end of your current billing period.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Termination of Service</h2>
            <p>We reserve the right to suspend or terminate your account at any time, with or without cause, if we determine that you have violated these Terms, engaged in fraudulent activity, or attempted to compromise the security of our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Risk Disclaimer & Limitation of Liability</h2>
            <p>Trading in financial markets (including Forex, Stocks, Indices, and Crypto) involves a high degree of risk and may not be suitable for all investors. MetaMetrics provides analytics and historical performance tracking; we do <em>not</em> provide financial, investment, or trading advice. Past performance is not indicative of future results. You are solely responsible for your trading decisions. MetaMetrics shall not be held liable for any financial losses incurred while using our software.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to These Terms</h2>
            <p>We may periodically update these Terms to reflect changes in our service or legal requirements. We will notify users of any significant changes via email or an in-app notification.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
