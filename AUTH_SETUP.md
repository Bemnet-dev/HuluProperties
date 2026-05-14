# Authentication Setup Guide

This guide explains how to set up and use the authentication system in Hulu Properties.

## Features

✅ **Email/Password Authentication**
- User registration with email verification
- Secure login with password
- Remember me functionality

✅ **Password Reset Flow**
- Forgot password functionality
- Secure email-based password reset
- Password strength validation

✅ **Session Management**
- Automatic session refresh
- Persistent login state
- Secure sign out

✅ **Admin Role Management**
- Role-based access control
- Admin-only features
- Protected routes

## Setup Instructions

### 1. Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Get your project credentials:
   - Go to Project Settings > API
   - Copy the `Project URL` and `anon/public` key

3. Add to your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Email Configuration

Configure email templates in Supabase:

1. Go to Authentication > Email Templates
2. Customize the following templates:
   - **Confirm signup**: Welcome email with verification link
   - **Reset password**: Password reset email with secure link
   - **Magic Link**: (Optional) Passwordless login

### 3. URL Configuration

Set up redirect URLs in Supabase:

1. Go to Authentication > URL Configuration
2. Add your site URL: `http://localhost:3000` (development)
3. Add redirect URLs:
   - `http://localhost:3000/reset-password`
   - `http://localhost:3000/login`
   - Add production URLs when deploying

### 4. Database Setup

Run the SQL schema to create necessary tables:

```sql
-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

## Usage

### Using the useAuth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      {isAdmin && <p>You are an admin</p>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Sign In

```typescript
const { signIn } = useAuth();

const handleLogin = async () => {
  const { data, error } = await signIn(email, password);
  if (error) {
    console.error('Login failed:', error);
  } else {
    console.log('Login successful');
  }
};
```

### Sign Up

```typescript
const { signUp } = useAuth();

const handleSignup = async () => {
  const { data, error } = await signUp(email, password, fullName);
  if (error) {
    console.error('Signup failed:', error);
  } else {
    console.log('Signup successful');
  }
};
```

### Reset Password

```typescript
const { resetPassword } = useAuth();

const handleReset = async () => {
  const { error } = await resetPassword(email);
  if (error) {
    console.error('Reset failed:', error);
  } else {
    console.log('Reset email sent');
  }
};
```

### Update Password

```typescript
const { updatePassword } = useAuth();

const handleUpdate = async () => {
  const { error } = await updatePassword(newPassword);
  if (error) {
    console.error('Update failed:', error);
  } else {
    console.log('Password updated');
  }
};
```

## Admin Access

To make a user an admin:

### Method 1: Email-based (Current)
The system automatically grants admin access to `creedbhope@gmail.com`

### Method 2: User Metadata
Update user metadata in Supabase:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';
```

### Method 3: Custom Profiles Table (Recommended for Production)

1. Create a profiles table:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

2. Update the useAuth hook to check the profiles table

## Protected Routes

### Client-side Protection

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected Content</div>;
}
```

### Admin-only Protection

```typescript
const { user, isAdmin, loading } = useAuth();

useEffect(() => {
  if (!loading && (!user || !isAdmin)) {
    router.push('/');
  }
}, [user, isAdmin, loading, router]);
```

## Security Best Practices

1. **Never expose sensitive keys**: Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only
2. **Use Row Level Security**: Always enable RLS on tables with user data
3. **Validate on server**: Don't trust client-side validation alone
4. **Use HTTPS**: Always use HTTPS in production
5. **Rate limiting**: Configure rate limits in Supabase dashboard
6. **Email verification**: Require email verification for sensitive operations

## Troubleshooting

### "Invalid or expired reset link"
- Check that the redirect URL is configured in Supabase
- Ensure the link hasn't expired (default: 1 hour)
- Verify the user clicked the link from the correct email

### "User not found"
- Check that the email is registered
- Verify email confirmation if required
- Check Supabase dashboard for user status

### Session not persisting
- Check browser cookies are enabled
- Verify localStorage is accessible
- Check for CORS issues in production

### Admin access not working
- Verify the email matches exactly
- Check user_metadata in Supabase dashboard
- Ensure the useAuth hook is properly initialized

## Email Templates

### Password Reset Email Template

```html
<h2>Reset your password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

### Welcome Email Template

```html
<h2>Welcome to Hulu Properties!</h2>
<p>Thanks for signing up. Click below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

## Support

For issues or questions:
- Check Supabase logs in the dashboard
- Review browser console for errors
- Check network tab for failed requests
- Contact: creedbhope@gmail.com
