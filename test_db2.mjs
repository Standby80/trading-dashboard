import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function test() {
  const { data, error } = await supabase.from('users').select('subscription_tier, full_name, avatar_url, trial_ends_at').limit(1);
  console.log('DATA:', data);
  console.log('ERROR:', error);
}

test();
