'use server';

import { createClient } from '@/lib/supabase/server';
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export async function getCheckoutURL(plan: 'monthly' | 'annually') {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be logged in to upgrade.');
    }

    // If API fails or we want a simpler direct redirect, we use the fallback method:
    // User provided these specific variant UUIDs:
    const monthlyVariantId = '0c2db059-c0f7-4ced-acdd-8b3d963c6390';
    const annualVariantId = 'b707dcbb-06d8-4119-82f4-16c260a0eb42';
    const storeName = 'metametrics';

    const variantId = plan === 'monthly' ? monthlyVariantId : annualVariantId;

    // Construct the direct checkout URL with the custom user_id parameter
    const checkoutUrl = `https://${storeName}.lemonsqueezy.com/checkout/buy/${variantId}?checkout[custom][user_id]=${user.id}&checkout[email]=${encodeURIComponent(user.email || '')}`;

    return { url: checkoutUrl };

  } catch (error: any) {
    console.error('Checkout action error:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
