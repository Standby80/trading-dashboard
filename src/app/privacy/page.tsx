import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Privacy Policy | MetaMetrics',
  description: 'Privacy Policy for MetaMetrics Trading Analytics',
};

export default function PrivacyPage() {
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
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <p>
            Welcome to the MetaMetrics Privacy Policy. Your privacy is critically important to us. This policy outlines how we collect, use, and protect your personal and financial data when you use the MetaMetrics platform and our MT4/MT5 sync tools.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>To provide you with our advanced analytics, we collect specific types of information. This includes your account details (such as email address for account management), payment information (processed securely by our payment provider, PayPal), and your trading history (transmitted securely via our Expert Advisor from your MT4 or MT5 terminal).</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Data</h2>
            <p>Your trading history is strictly utilized to generate performance metrics, populate your private dashboard, and provide you with actionable insights. We do not use your trading data for any other purpose, nor do we use it to trade against you or sell it to third-party institutions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Protection & Security</h2>
            <p>We implement industry-standard security measures, including end-to-end encryption, to safeguard your personal and trading data. Our Expert Advisor operates on a strict "Read-Only" basis, meaning we never have access to your brokerage passwords or the ability to execute, modify, or close trades on your behalf.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Sharing</h2>
            <p>We respect your privacy and do not sell, rent, or share your personal information or trading data with external third parties for marketing purposes. Data is only shared with trusted service providers (like our payment processor) strictly to facilitate the services we offer you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies and Tracking Technologies</h2>
            <p>MetaMetrics uses essential cookies primarily for authentication and maintaining your secure user session while you are logged into the dashboard. We do not use intrusive tracking cookies to follow your activity across the internet.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
