-- Migration V4: Add client_name to mt5_accounts table
ALTER TABLE public.mt5_accounts 
ADD COLUMN IF NOT EXISTS client_name TEXT;
