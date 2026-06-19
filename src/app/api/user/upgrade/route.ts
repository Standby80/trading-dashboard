import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subscriptionID } = body;

    if (!subscriptionID) {
      return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    // Update user's subscription tier to premium in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ subscription_tier: 'premium' })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error upgrading user to Premium:', updateError);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in upgrade route:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
