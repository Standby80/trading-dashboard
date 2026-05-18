import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redis } from '@/lib/redis';

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all trades for this user
    const { error: deleteError } = await supabase
      .from('trades')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to clear trades:', deleteError);
      return NextResponse.json({ error: 'Failed to clear trades' }, { status: 500 });
    }

    // Clear the cache
    if (redis) {
      const cacheKey = `dashboard_data_v2_${user.id}`;
      await redis.del(cacheKey);
      
      // Also clear old cache key just in case
      await redis.del(`dashboard_data_${user.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Clear data error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
