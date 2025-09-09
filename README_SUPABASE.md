# Supabase Integration Guide

## Setup Instructions

### 1. Create Supabase Project

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Create a new project
3. Save your project URL and anon key

### 2. Configure Environment Variables

Add to `.env.local`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Setup Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Run the SQL from `supabase/schema.sql`
3. This creates:
   - `profiles` table for user data
   - `storybooks` table for storing books
   - Row Level Security policies
   - Automatic triggers for new users

### 4. Enable Google OAuth

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
4. Copy the redirect URL from Supabase
5. Add this redirect URL to your Google OAuth app in Google Cloud Console

### 5. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI from Supabase (e.g., `https://yourproject.supabase.co/auth/v1/callback`)

## Features

- **Authentication**: Google OAuth via Supabase Auth
- **Database**: PostgreSQL with Row Level Security
- **Real-time**: Subscribe to database changes (optional)
- **Storage**: Can be added for image storage (future enhancement)

## Data Structure

### Profiles Table
- Links to Supabase auth.users
- Stores user metadata (name, avatar)
- Automatically created on signup

### Storybooks Table
- Stores all user storybooks
- Pages stored as JSONB
- User can only access their own books

## Security

- Row Level Security (RLS) enabled
- Users can only CRUD their own data
- Anon key is safe for client-side use
- Service role key should never be exposed

## Usage in App

The app now uses Supabase for:
1. **Authentication**: Login/logout with Google
2. **User Management**: Profile data from Google
3. **Future**: Store storybooks in database instead of localStorage