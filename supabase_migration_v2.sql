-- Migration V2: Add hold_time_mins to public.trades table
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS hold_time_mins NUMERIC;
