import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Refund Policy | MetaMetrics',
  description: 'Refund Policy for MetaMetrics Trading Analytics',
};

export default function RefundPage() {
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
        
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Summary</h2>
            <p>Clearly states our stance on refunds.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. 7-Day Free Trial</h2>
            <p>Since we offer a 7-day free trial, users have ample time to test the functionality of our MetaMetrics dashboard and MT4 & MT5 sync before committing to a subscription.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Refunds</h2>
            <p>Due to the nature of digital SaaS products and the provided free trial period, all subscription charges are final and non-refundable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Cancellation</h2>
            <p>You may cancel your subscription at any time. You will retain access to the platform until the end of your current billing period.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
