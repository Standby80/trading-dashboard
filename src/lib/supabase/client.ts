import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://plskbkumwrlkfqbicgss.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc2tia3Vtd3Jsa2ZxYmljZ3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzMxOTcsImV4cCI6MjA5NDU0OTE5N30.cIb8wBfdUvOENEJb83MAZKOmX9BYB9LKJDP_NleL7rE';

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
