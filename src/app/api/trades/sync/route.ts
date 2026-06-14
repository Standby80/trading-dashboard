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

    const apiKey = authHeader.split(' ')[1]?.trim();

    // Verify API Key
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, subscription_tier, trial_ends_at, discord_webhook_url')
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

    // Diff trades to find truly NEW trades for Discord Webhooks
    const incomingTicketIds = tradesToInsert.map((t: any) => t.ticket_id);
    const { data: existingTrades } = await supabaseAdmin
      .from('trades')
      .select('ticket_id')
      .eq('user_id', userProfile.id)
      .in('ticket_id', incomingTicketIds);
      
    const existingSet = new Set(existingTrades?.map((t: any) => t.ticket_id) || []);
    const newTrades = tradesToInsert.filter((t: any) => !existingSet.has(t.ticket_id));

    // Insert to database (upsert by ticket_id and user_id to avoid duplicates)
    const { error: insertError } = await supabaseAdmin
      .from('trades')
      .upsert(tradesToInsert, { onConflict: 'user_id, ticket_id' });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to insert trades' }, { status: 500 });
    }

    // Trigger Discord Webhook for newly closed trades (limit to 5 to avoid spam during initial sync)
    if (userProfile.discord_webhook_url && newTrades.length > 0 && newTrades.length <= 5) {
      for (const trade of newTrades) {
        const profit = Number(trade.profit) || 0;
        const symbol = trade.symbol || 'Unknown';
        const type = trade.type || 'TRADE';
        
        // Only notify about actual market trades, not deposits/withdrawals
        if (type === 'DEPOSIT' || type === 'BALANCE' || type === 'DEAL_TYPE_BALANCE' || symbol === 'DEPOSIT') {
          continue;
        }

        const isWin = profit > 0;
        const color = isWin ? 3066993 : 15158332; // Green : Red

        const embed = {
          title: `${isWin ? '✅ Winning Trade' : '❌ Losing Trade'} Closed!`,
          color: color,
          fields: [
            { name: 'Symbol', value: symbol, inline: true },
            { name: 'Type', value: type.replace('DEAL_TYPE_', ''), inline: true },
            { name: 'Net Profit', value: `$${profit.toFixed(2)}`, inline: true },
            { name: 'Account', value: account_name, inline: false },
          ],
          footer: { text: 'MetaMetrics Automated Sync' },
          timestamp: new Date().toISOString()
        };

        try {
          await fetch(userProfile.discord_webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
          });
        } catch (e) {
          console.error("Failed to trigger Discord webhook", e);
        }
      }
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
