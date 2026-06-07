import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { redis } from '@/lib/redis';

// We rely on the API Key for authentication instead of Supabase Auth tokens.

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 401 });
    }

    const apiKey = authHeader.split(' ')[1];

    // Verify API Key
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, subscription_tier, trial_ends_at')
      .eq('api_key', apiKey)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    const isPremium = userProfile.subscription_tier === 'premium';
    const isTrialActive = userProfile.trial_ends_at && new Date(userProfile.trial_ends_at) > new Date();

    if (!isPremium && !isTrialActive) {
       return NextResponse.json({ error: 'Payment Required: Your 7-day free trial has expired.' }, { status: 402 });
    }

    const body = await req.json();
    const { trades, account_number, broker_name, client_name } = body;

    if (!trades || !Array.isArray(trades)) {
      return NextResponse.json({ error: 'Invalid payload format. Expected { "trades": [...] }' }, { status: 400 });
    }

    let mt5_account_id = null;
    let account_name = "Default";

    if (account_number) {
       account_name = `MT5 - ${account_number}`;
       
       // Try to find existing mt5_account
       const { data: accountData } = await supabaseAdmin
         .from('mt5_accounts')
         .select('id')
         .eq('user_id', userProfile.id)
         .eq('account_number', String(account_number))
         .maybeSingle();

       if (accountData) {
         mt5_account_id = accountData.id;
         
         // Update existing account with client_name and broker_server if provided
         if (client_name || broker_name) {
           await supabaseAdmin
             .from('mt5_accounts')
             .update({
               client_name: client_name || null,
               broker_server: broker_name || 'Unknown Broker'
             })
             .eq('id', mt5_account_id);
         }
       } else {
         // Create new mt5_account if it doesn't exist
         const { data: newAccount } = await supabaseAdmin
           .from('mt5_accounts')
           .insert({
             user_id: userProfile.id,
             account_number: String(account_number),
             broker_server: broker_name || 'Unknown Broker',
             client_name: client_name || null
           })
           .select('id')
           .single();
         
         if (newAccount) {
           mt5_account_id = newAccount.id;
         }
       }
    }

    // Attach user_id and mt5_account_id to all trades
    const tradesToInsert = trades.map((t: any) => ({
      ...t,
      user_id: userProfile.id,
      mt5_account_id: mt5_account_id || t.mt5_account_id,
      account_name: account_name,
      open_price: t.openPrice || t.open_price || 0,
      close_price: t.closePrice || t.close_price || 0
    }));

    // Insert to database (upsert by ticket_id and user_id to avoid duplicates)
    const { error: insertError } = await supabaseAdmin
      .from('trades')
      .upsert(tradesToInsert, { onConflict: 'user_id, ticket_id' });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to insert trades' }, { status: 500 });
    }

    // Clear cache for this user so the dashboard updates live
    if (redis) {
       const keys = await redis.keys(`dashboard_data_*${userProfile.id}*`);
       if (keys.length > 0) {
         await redis.del(...keys);
       }
    }

    return NextResponse.json({ success: true, count: tradesToInsert.length });

  } catch (err: any) {
    console.error('Sync API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
