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
    const { title, notes, screenshot_url, account_name = 'Default' } = body

    if (!notes) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const ticketId = `note-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`

    const newNote = {
      ticket_id: ticketId,
      user_id: user.id,
      account_name: account_name,
      symbol: title || 'Journal Note',
      type: 'NOTE',
      open_time: now,
      close_time: now,
      profit: 0,
      volume: 0,
      open_price: 0,
      close_price: 0,
      commission: 0,
      swap: 0,
      notes: notes,
      screenshot_url: screenshot_url || null,
      magic_number: 0,
      stop_loss: 0,
      take_profit: 0
    }

    const { error } = await supabase
      .from('trades')
      .insert(newNote)

    if (error) {
      console.error('Error inserting journal note:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket_id: ticketId })
  } catch (error: any) {
    console.error('Error in POST /api/journal:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
