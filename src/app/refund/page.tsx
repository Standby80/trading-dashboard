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
          <p>
            This Refund Policy outlines the terms regarding cancellations and refunds for the MetaMetrics service. We strive to provide complete transparency regarding our billing practices.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. The 7-Day Free Trial</h2>
            <p>We are confident in the value MetaMetrics provides, which is why we offer a comprehensive 7-day free trial. This trial period grants you full access to all premium features, allowing you ample time to install the MT4/MT5 sync tool, test the dashboard, and ensure the software meets your expectations before any billing occurs.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Refund Eligibility</h2>
            <p>Due to the digital nature of our SaaS product and the upfront provision of a 7-day free trial, all subscription charges are considered final and non-refundable once processed. We encourage all users to thoroughly evaluate the platform during their trial period.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Subscription Cancellations</h2>
            <p>You have full control over your subscription. You may cancel your subscription at any time directly through your account settings. Upon cancellation, you will not be billed for any subsequent cycles, and you will retain full access to your MetaMetrics dashboard until the conclusion of your current paid billing period.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Exceptional Circumstances</h2>
            <p>While our standard policy is non-refundable, we understand that exceptional circumstances (such as technical failures solely on our end that prevent the use of the service) may occur. If you believe you have experienced a critical service failure, please contact our support team, and we will review your case individually.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
