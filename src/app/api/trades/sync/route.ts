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
      .select('id, subscription_tier')
      .eq('api_key', apiKey)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    if (userProfile.subscription_tier !== 'premium') {
       return NextResponse.json({ error: 'Sync API requires Premium subscription' }, { status: 403 });
    }

    const body = await req.json();
    const { trades } = body;

    if (!trades || !Array.isArray(trades)) {
      return NextResponse.json({ error: 'Invalid payload format. Expected { "trades": [...] }' }, { status: 400 });
    }

    // Attach user_id to all trades
    const tradesToInsert = trades.map((t: any) => ({
      ...t,
      user_id: userProfile.id,
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
