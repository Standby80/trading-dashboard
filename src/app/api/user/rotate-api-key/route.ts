import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newApiKey = crypto.randomUUID();

    const { error } = await supabase
      .from('users')
      .update({ api_key: newApiKey })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to rotate API key' }, { status: 500 });
    }

    return NextResponse.json({ newApiKey });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
