import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { trades } = body

    if (!trades || !Array.isArray(trades)) {
      return NextResponse.json({ error: 'Invalid trades payload' }, { status: 400 })
    }

    // Assign user_id to all trades
    const tradesWithUser = trades.map((t: any) => ({
      ...t,
      user_id: user.id
    }))

    // 1. Delete existing trades for the user
    const { error: deleteError } = await supabase
      .from('trades')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Failed to delete old trades:', deleteError)
      return NextResponse.json({ error: 'Failed to clear old history' }, { status: 500 })
    }

    // 2. Insert or update new trades
    const { error: insertError } = await supabase
      .from('trades')
      .upsert(tradesWithUser)

    if (insertError) {
      console.error('Failed to insert new trades:', insertError)
      return NextResponse.json({ error: insertError.message || 'Failed to save new trades' }, { status: 500 })
    }

    // 3. Clear Redis cache
    if (redis) {
      try {
        await redis.del(`dashboard_data_${user.id}`)
      } catch (redisErr) {
        console.error('Failed to clear redis cache:', redisErr)
        // non-blocking
      }
    }

    return NextResponse.json({ success: true, count: trades.length })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
