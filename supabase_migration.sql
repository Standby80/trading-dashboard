-- 1. Create the custom users table for subscription and sync features
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    subscription_tier TEXT DEFAULT 'free', -- 'free', 'basic', 'premium'
    api_key UUID DEFAULT gen_random_uuid(), -- Used for MQL5 MT5 Auto-sync
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) + INTERVAL '7 days'
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can only read their own data
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- 4. Policy: Users can only update their own data
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- 5. Trigger Function: Automatically insert into public.users when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, trial_ends_at)
    VALUES (new.id, new.email, timezone('utc'::text, now()) + INTERVAL '7 days');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach Trigger to auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Backfill existing users (Insert existing users into the new table)
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
