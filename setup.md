# DadConnect Setup Guide

## 1. Environment Setup

### Web App (.env.local)
Copy `dad-connect-frontend/env.example` to `dad-connect-frontend/.env.local` and fill in:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vkzcwjhymvxtfjwblkzn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Database Connection (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=postgresql://postgres:Dadconnect2025$$@db.vkzcwjhymvxtfjwblkzn.supabase.co:5432/postgres

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Mobile App (.env)
Copy `apps/mobile/env.example` to `apps/mobile/.env` and fill in:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://vkzcwjhymvxtfjwblkzn.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_publishable_key_here

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# Deep Link Scheme
EXPO_PUBLIC_SCHEME=dadconnect
```

## 2. Get Your Supabase Keys

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your `dadConnect` project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
   - **anon public** → `EXPO_PUBLIC_SUPABASE_KEY` (for mobile)

## 3. Apply Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `dad-connect-frontend/db/schema.sql`
4. Click "Run" to create all tables and RLS policies
5. Copy and paste the contents of `dad-connect-frontend/db/seed.sql`
6. Click "Run" to seed initial data

## 4. Install Dependencies

```bash
# From repo root
npm install

# Install mobile-specific deps
cd apps/mobile
npm install
```

## 5. Run the Apps

### Web App
```bash
# From repo root
npm run dev:web
# Or from dad-connect-frontend directory
npm run dev
```

### Mobile App
```bash
# From repo root
npm run dev:mobile
# Or from apps/mobile directory
npm start
```

## 6. Test Database Connection

The web app will now:
- Connect to Supabase for auth
- Use the database for feed, library, and saves
- Support mobile app API calls

## 7. Mobile Deep Linking

For mobile testing:
- iOS Simulator: Press `i` after starting Expo
- Android Emulator: Press `a` after starting Expo
- Physical Device: Scan QR code with Expo Go app

## Troubleshooting

### Database Connection Issues
- Verify your password is correct: `Dadconnect2025$$`
- Check that your IP is allowed in Supabase dashboard
- Ensure RLS policies are applied correctly

### Mobile Issues
- Make sure `EXPO_PUBLIC_API_URL` points to your web app
- For device testing, use your machine's LAN IP (e.g., `192.168.1.100:3000`)

### Auth Issues
- Verify your Supabase keys are correct
- Check that auth is enabled in your Supabase project
- Ensure redirect URLs are configured for mobile deep linking
