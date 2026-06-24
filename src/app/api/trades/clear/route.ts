import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redis } from '@/lib/redis';

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountName = searchParams.get('account');
    const type = searchParams.get('type');

    if (!accountName) {
      return NextResponse.json({ error: 'Account name is required' }, { status: 400 });
    }

    // If type is specified, only delete trades of that type
    if (type) {
      const { error: deleteTradesError } = await supabase
        .from('trades')
        .delete()
        .eq('user_id', user.id)
        .eq('account_name', accountName)
        .eq('type', type);

      if (deleteTradesError) {
        console.error('Failed to clear trades of type:', deleteTradesError);
        return NextResponse.json({ error: 'Failed to clear trades' }, { status: 500 });
      }
      
      // Clear the cache
      if (redis) {
        const keys = await redis.keys(`dashboard_data_*${user.id}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
      return NextResponse.json({ success: true });
    }

    // Delete ALL trades for this specific account
    const { error: deleteTradesError } = await supabase
      .from('trades')
      .delete()
      .eq('user_id', user.id)
      .eq('account_name', accountName);

    if (deleteTradesError) {
      console.error('Failed to clear trades:', deleteTradesError);
      return NextResponse.json({ error: 'Failed to clear trades' }, { status: 500 });
    }

    // Also delete the report for this account so it completely disappears
    await supabase
      .from('reports')
      .delete()
      .eq('user_id', user.id)
      .eq('account_name', accountName);

    // If it's an MT5 account, delete it from mt5_accounts
    if (accountName.startsWith('MT5 - ')) {
      const accountNumber = accountName.replace('MT5 - ', '');
      await supabase
        .from('mt5_accounts')
        .delete()
        .eq('user_id', user.id)
        .eq('account_number', accountNumber);
    }

    // Clear the cache
    if (redis) {
      const keys = await redis.keys(`dashboard_data_*${user.id}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Clear data error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
