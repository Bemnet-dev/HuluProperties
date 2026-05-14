# Quick Fix for Supabase Data Fetching

## Problem
The application is failing to fetch data from Supabase.

## Solution

### Step 1: Configure Supabase Credentials

1. Open `.env.local` file in the root directory
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get these:**
- Go to [supabase.com/dashboard](https://supabase.com/dashboard)
- Select your project (or create one)
- Go to Settings > API
- Copy "Project URL" and "anon/public" key

### Step 2: Restart Development Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Check Connection Status

Once the server restarts, you'll see a **Supabase Status** indicator in the bottom-right corner of your browser showing:
- ✅ Green = Connected
- ❌ Red = Error (check console for details)

### Step 4: Set Up Database (If New Project)

If you just created a Supabase project, you need to create the tables:

1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Follow the complete guide in `SUPABASE_SETUP.md`

## What Was Fixed

### 1. Enhanced Supabase Client (`lib/supabase.ts`)
- ✅ Better error handling
- ✅ Connection validation
- ✅ Environment variable checking
- ✅ Auto-refresh tokens
- ✅ Session persistence

### 2. New API Helper Functions (`lib/api.ts`)
- ✅ `fetchListings()` - Get all listings
- ✅ `fetchListingById()` - Get single listing
- ✅ `fetchUserFavorites()` - Get user favorites
- ✅ `addFavorite()` - Add to favorites
- ✅ `removeFavorite()` - Remove from favorites
- ✅ `createListing()` - Create new listing
- ✅ `updateListing()` - Update listing
- ✅ `deleteListing()` - Delete listing
- ✅ `uploadImage()` - Upload images
- ✅ `deleteImage()` - Delete images

### 3. Enhanced Auth Hook (`hooks/useAuth.ts`)
- ✅ `signIn()` - Login with email/password
- ✅ `signUp()` - Register new user
- ✅ `resetPassword()` - Send reset email
- ✅ `updatePassword()` - Update password
- ✅ Better error handling
- ✅ Session management
- ✅ Admin role checking

### 4. Status Indicator (`components/SupabaseStatus.tsx`)
- ✅ Real-time connection status
- ✅ Configuration validation
- ✅ Error messages
- ✅ Setup guide link

## Common Issues

### Issue: "Failed to fetch"
**Solution:** 
- Check `.env.local` has correct credentials
- Restart dev server after updating `.env.local`
- Check Supabase project is not paused

### Issue: "Invalid API key"
**Solution:**
- Make sure you copied the **anon/public** key, not the service_role key
- Check for extra spaces in the key
- Regenerate the key in Supabase if needed

### Issue: "Table does not exist"
**Solution:**
- Run the SQL from `SUPABASE_SETUP.md` to create tables
- Check table names match exactly (case-sensitive)

### Issue: "Row Level Security" error
**Solution:**
- Make sure RLS policies are created (see `SUPABASE_SETUP.md`)
- Check you're authenticated when accessing protected data

## Testing the Fix

1. **Homepage**: Should load featured listings
2. **Listings Page**: Should show all active listings
3. **Login**: Should authenticate successfully
4. **Favorites**: Should save/remove favorites (when logged in)
5. **Admin**: Should create/edit listings (when logged in as admin)

## Need Help?

1. Check browser console for error messages
2. Check Supabase logs in dashboard
3. Review `SUPABASE_SETUP.md` for detailed setup
4. Review `AUTH_SETUP.md` for auth configuration

## Files Modified

- ✅ `lib/supabase.ts` - Enhanced client
- ✅ `lib/api.ts` - New API helpers
- ✅ `hooks/useAuth.ts` - Enhanced auth
- ✅ `components/SupabaseStatus.tsx` - Status indicator
- ✅ `app/(main)/layout.tsx` - Added status component
- ✅ `.env.local` - Created with placeholders

## Next Steps

1. Update `.env.local` with your credentials
2. Restart the dev server
3. Check the status indicator
4. If new project, run the SQL setup
5. Test the application
