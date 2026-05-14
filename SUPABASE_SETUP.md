# Supabase Setup Guide

This guide will help you set up Supabase for the Hulu Properties application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: Hulu Properties
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

3. Update your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the following SQL:

```sql
-- Create listings table
CREATE TABLE listings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Property', 'Vehicle', 'Land')),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Sold', 'Pending')),
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id BIGINT REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Listings policies (public read, admin write)
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  USING (status = 'Active');

CREATE POLICY "Authenticated users can insert listings"
  ON listings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update listings"
  ON listings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete listings"
  ON listings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. Click "Run" to execute the SQL

## Step 4: Set Up Storage (for images)

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name it: `listings`
4. Make it **Public** (so images can be viewed)
5. Click "Create bucket"

### Set Storage Policies

1. Click on the `listings` bucket
2. Go to **Policies** tab
3. Click "New Policy"
4. Create these policies:

**Policy 1: Public Read**
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listings');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listings' AND
  auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated Delete**
```sql
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listings' AND
  auth.role() = 'authenticated'
);
```

## Step 5: Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Go to **Authentication** > **URL Configuration**
4. Add these URLs:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: 
     - `http://localhost:3000/reset-password`
     - `http://localhost:3000/login`
     - Add your production URLs when deploying

## Step 6: Customize Email Templates (Optional)

1. Go to **Authentication** > **Email Templates**
2. Customize these templates:
   - **Confirm signup**
   - **Reset password**
   - **Magic Link**

## Step 7: Add Sample Data (Optional)

Run this SQL to add some sample listings:

```sql
INSERT INTO listings (title, description, price, location, type, images, specs) VALUES
('Luxury Penthouse', 'Stunning penthouse with panoramic city views', 'ETB 25,000,000', 'Addis Ababa, Ethiopia', 'Property', 
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'], 
 '[{"key": "Bedrooms", "value": "4"}, {"key": "Bathrooms", "value": "3"}]'::jsonb),

('2024 Range Rover', 'Brand new luxury SUV with all features', 'ETB 8,500,000', 'Addis Ababa, Ethiopia', 'Vehicle',
 ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6'],
 '[{"key": "Year", "value": "2024"}, {"key": "Engine", "value": "3.0L V6"}]'::jsonb),

('Prime Land Plot', 'Investment-grade land in developing area', 'ETB 15,000,000', 'Bahir Dar, Ethiopia', 'Land',
 ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef'],
 '[{"key": "Size", "value": "5000 sqm"}, {"key": "Zoning", "value": "Commercial"}]'::jsonb);
```

## Step 8: Test the Connection

1. Restart your Next.js development server:
```bash
npm run dev
```

2. Check the browser console for connection messages
3. Try to view listings on the homepage
4. Try to sign up/login

## Troubleshooting

### "Failed to fetch" error
- ✅ Check that `.env.local` has correct credentials
- ✅ Restart the dev server after updating `.env.local`
- ✅ Check browser console for specific error messages
- ✅ Verify Supabase project is active (not paused)

### "Row Level Security" errors
- ✅ Make sure RLS policies are created (Step 3)
- ✅ Check that you're authenticated when trying to add favorites
- ✅ Verify the policies match your use case

### Images not loading
- ✅ Check that storage bucket is **Public**
- ✅ Verify storage policies are set correctly
- ✅ Make sure image URLs are correct

### Authentication not working
- ✅ Check redirect URLs are configured
- ✅ Verify email provider is enabled
- ✅ Check browser console for auth errors
- ✅ Make sure cookies are enabled

## Useful Supabase Commands

### Check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### View all listings:
```sql
SELECT * FROM listings;
```

### View all favorites:
```sql
SELECT * FROM favorites;
```

### Count listings by type:
```sql
SELECT type, COUNT(*) 
FROM listings 
GROUP BY type;
```

## Next Steps

1. ✅ Set up your Supabase project
2. ✅ Update `.env.local` with credentials
3. ✅ Run the SQL to create tables
4. ✅ Set up storage bucket
5. ✅ Configure authentication
6. ✅ Add sample data (optional)
7. ✅ Test the application

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Issues: Check browser console and Supabase logs
