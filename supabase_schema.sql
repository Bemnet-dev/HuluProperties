-- Run this in your Supabase SQL Editor to create the listings table

CREATE TABLE IF NOT EXISTS public.listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  price text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'Active'::text,
  images text[] DEFAULT '{}'::text[],
  specs jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to listings
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.listings;
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.listings FOR SELECT 
USING ( true );

-- Allow authenticated admins to insert, update, and delete listings
DROP POLICY IF EXISTS "Users can insert their own listings." ON public.listings;
CREATE POLICY "Users can insert their own listings." 
ON public.listings FOR INSERT 
WITH CHECK ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can update listings." ON public.listings;
CREATE POLICY "Users can update listings." 
ON public.listings FOR UPDATE
USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can delete listings." ON public.listings;
CREATE POLICY "Users can delete listings." 
ON public.listings FOR DELETE
USING ( auth.role() = 'authenticated' );

-- ⚠️ TESTING ONLY: If you are getting RLS errors because you are not logged in yet,
-- you can temporarily run these policies to allow ANYONE to insert, update, and delete:
-- DROP POLICY IF EXISTS "Allow anonymous inserts for testing" ON public.listings;
-- CREATE POLICY "Allow anonymous inserts for testing" ON public.listings FOR INSERT WITH CHECK ( true );
-- DROP POLICY IF EXISTS "Allow anonymous updates for testing" ON public.listings;
-- CREATE POLICY "Allow anonymous updates for testing" ON public.listings FOR UPDATE USING ( true );
-- DROP POLICY IF EXISTS "Allow anonymous deletes for testing" ON public.listings;
-- CREATE POLICY "Allow anonymous deletes for testing" ON public.listings FOR DELETE USING ( true );

-- Note: Make sure your storage bucket 'assets' exists and is public
-- You may need to create it manually in the Supabase Storage UI

-------------------------------------------------------------------------
-- STORAGE BUCKET & POLICIES SETUP
-------------------------------------------------------------------------
-- 1. Create the 'assets' bucket if it doesn't exist (and make it public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view/download images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'assets' );

-- 3. Allow uploads (Change to 'authenticated' instead of 'true' if you only want logged-in users to upload)
-- We are using 'true' here to allow you to test uploads without being logged in.
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'assets' );

-- 4. Allow updates/deletes to images
DROP POLICY IF EXISTS "Allow Updates" ON storage.objects;
CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'assets' );

DROP POLICY IF EXISTS "Allow Deletes" ON storage.objects;
CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'assets' );
