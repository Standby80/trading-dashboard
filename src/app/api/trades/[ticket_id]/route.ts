import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: Request, { params }: { params: Promise<{ ticket_id: string }> }) {
  try {
    const { ticket_id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notes, screenshot_url } = body;

    const updates: any = {};
    if (notes !== undefined) updates.notes = notes;
    if (screenshot_url !== undefined) updates.screenshot_url = screenshot_url;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from('trades')
      .update(updates)
      .eq('ticket_id', ticket_id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Clear cache for this user so the dashboard updates live
    const { redis } = await import('@/lib/redis');
    if (redis) {
       const keys = await redis.keys(`dashboard_data_*${user.id}*`);
       if (keys.length > 0) {
         await redis.del(...keys);
       }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
