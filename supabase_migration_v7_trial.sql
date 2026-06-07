-- 1. Add trial_ends_at column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) + INTERVAL '7 days';

-- 2. Update existing 'free' users to have 7 days of trial from right now (so they don't get locked out immediately)
UPDATE public.users 
SET trial_ends_at = timezone('utc'::text, now()) + INTERVAL '7 days' 
WHERE subscription_tier = 'free' AND trial_ends_at IS NULL;

-- 3. Update the handle_new_user trigger to explicitly set trial_ends_at if needed
-- (Though DEFAULT NOW() + 7 days covers this automatically, it's good practice)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, trial_ends_at)
    VALUES (new.id, new.email, timezone('utc'::text, now()) + INTERVAL '7 days');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
