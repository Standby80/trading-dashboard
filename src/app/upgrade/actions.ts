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

    // Initialize Lemon Squeezy with the API key from environment variables
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
      throw new Error('Lemon Squeezy API key is not configured.');
    }
    
    lemonSqueezySetup({ apiKey });

    // Store ID
    const storeIdStr = process.env.LEMON_SQUEEZY_STORE_ID || '12345'; // Replace with real Store ID in .env

    // Map plans to their respective Variant IDs
    const variantIdStr = plan === 'monthly' 
      ? process.env.LEMON_SQUEEZY_MONTHLY_VARIANT_ID || '111111' 
      : process.env.LEMON_SQUEEZY_ANNUAL_VARIANT_ID || '222222';

    // Create a checkout session (must pass as numbers)
    const storeId = Number(storeIdStr);
    const variantId = Number(variantIdStr);

    const checkoutResult = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: user.email,
        custom: {
          user_id: user.id
        }
      }
    });

    if (checkoutResult.error) {
      console.error('Error creating checkout:', checkoutResult.error);
      throw new Error('Failed to generate checkout link.');
    }

    const checkoutUrl = checkoutResult.data?.data?.attributes?.url;
    
    if (!checkoutUrl) {
      throw new Error('No checkout URL returned.');
    }

    return { url: checkoutUrl };

  } catch (error: any) {
    console.error('Checkout action error:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
