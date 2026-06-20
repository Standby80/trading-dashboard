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
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Summary</h2>
            <p>Defines the rules for using MetaMetrics.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Service</h2>
            <p>Access to the MetaMetrics dashboard, MT4 & MT5 sync, and journaling tools.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Account</h2>
            <p>Users are responsible for maintaining the security of their account and API keys.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Prohibitions</h2>
            <p>You may not reverse-engineer the .ex5 file or the MetaMetrics API.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Termination</h2>
            <p>We reserve the right to suspend accounts that violate these terms or engage in fraudulent activity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer</h2>
            <p>Trading involves significant risk. MetaMetrics provides analytics, not financial advice. Users are solely responsible for their trading decisions.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
