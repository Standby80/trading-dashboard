import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase Admin client inside the handler to prevent build-time errors
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase URL or Service Key is missing in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    // Verify the signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error('Invalid Lemon Squeezy signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;

    if (!customData || !customData.user_id) {
      console.error('No custom data or user_id found in webhook payload');
      return NextResponse.json({ error: 'Missing user_id in custom data' }, { status: 400 });
    }

    const userId = customData.user_id;

    console.log(`Received ${eventName} event for user ${userId}`);

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      // Upgrade user to Premium
      const { error } = await supabaseAdmin
        .from('users')
        .update({ subscription_tier: 'Premium' })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user to Premium:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }

      console.log(`Successfully upgraded user ${userId} to Premium.`);
    } else if (
      eventName === 'subscription_cancelled' || 
      eventName === 'subscription_expired' || 
      eventName === 'subscription_payment_failed'
    ) {
      // Downgrade user back to Free
      const { error } = await supabaseAdmin
        .from('users')
        .update({ subscription_tier: 'Free' })
        .eq('id', userId);

      if (error) {
        console.error('Error downgrading user:', error);
        return NextResponse.json({ error: 'Failed to downgrade user' }, { status: 500 });
      }

      console.log(`Successfully downgraded user ${userId} to Free.`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
