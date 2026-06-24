import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { symbol, type, volume, open_price, close_price, profit, notes, screenshot_url, date, ticket_id, account_name = 'Default' } = body

    if (!notes) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 })
    }

    const now = date ? new Date(date).toISOString() : new Date().toISOString()
    const finalTicketId = ticket_id || `note-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`

    const newNote = {
      ticket_id: finalTicketId,
      user_id: user.id,
      account_name: account_name,
      symbol: symbol || 'Journal Note',
      type: type || 'NOTE',
      open_time: now,
      close_time: now,
      profit: profit || 0,
      volume: volume || 0,
      open_price: open_price || 0,
      close_price: close_price || 0,
      commission: 0,
      swap: 0,
      hold_time_mins: 0,
      notes: notes,
      screenshot_url: screenshot_url || null
    }

    const { error } = await supabase
      .from('trades')
      .upsert(newNote)

    if (error) {
      console.error('Error inserting/updating journal note:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket_id: finalTicketId })
  } catch (error: any) {
    console.error('Error in POST /api/journal:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
