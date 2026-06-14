-- supabase_migration_v8_social.sql
-- Lägger till fält för publika profiler och Discord Webhooks

-- Lägg till kolumner i users-tabellen om de inte redan finns
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS discord_webhook_url text;

-- Skapa index på username för snabbare uppslag av publika profiler
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- RLS (Row Level Security) Policys
-- Tillåt alla att LÄSA (SELECT) profiler där is_public = true
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users FOR SELECT 
USING (is_public = true);

-- OBS: Eftersom `users` redan har policys för den inloggade användaren
-- bör de redan kunna uppdatera sina egna rader via `auth.uid() = id`.
