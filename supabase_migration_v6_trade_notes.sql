-- Migration V6: Add trade notes and screenshots bucket

-- 1. Add columns to trades table
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- 2. Create the Storage Bucket for trade screenshots if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trade_screenshots', 'trade_screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies for the 'trade_screenshots' bucket

-- Allow public read access to trade screenshots (or we could restrict it to authenticated users, but public URLs are easier to display on the dashboard as long as the URLs are hard to guess)
CREATE POLICY "Trade screenshots are publicly accessible." 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'trade_screenshots' );

-- Allow authenticated users to upload their own screenshots
CREATE POLICY "Users can upload their own trade screenshots." 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'trade_screenshots' AND auth.role() = 'authenticated' );

-- Allow users to update their own screenshots
CREATE POLICY "Users can update their own trade screenshots." 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'trade_screenshots' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'trade_screenshots' AND auth.role() = 'authenticated' );

-- Allow users to delete their own screenshots
CREATE POLICY "Users can delete their own trade screenshots." 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'trade_screenshots' AND auth.uid() = owner );
