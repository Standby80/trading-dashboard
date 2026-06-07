const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://plskbkumwrlkfqbicgss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc2tia3Vtd3Jsa2ZxYmljZ3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzMxOTcsImV4cCI6MjA5NDU0OTE5N30.cIb8wBfdUvOENEJb83MAZKOmX9BYB9LKJDP_NleL7rE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('users').select('subscription_tier, trial_ends_at').limit(1);
  console.log("DB response:", data, error);
}
test();
