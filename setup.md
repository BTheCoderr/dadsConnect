# DadConnect setup

DadConnect now has a dedicated Supabase project. Do not reuse credentials or database URLs from earlier versions of this repository.

## Supabase

Project URL:

```text
https://swkmxrkwjlwtauymocmg.supabase.co
```

Project ref:

```text
swkmxrkwjlwtauymocmg
```

The browser and Expo clients use the Supabase **publishable key**. A service-role key or direct Postgres password must never be placed in either client environment file.

## Web

```bash
cp apps/web/env.example apps/web/.env.local
npm install
npm run dev:web
```

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://swkmxrkwjlwtauymocmg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Mobile

```bash
cp apps/mobile/env.example apps/mobile/.env
npm run dev:mobile
```

Required variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://swkmxrkwjlwtauymocmg.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=<publishable key>
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SCHEME=dadconnect
```

## Database

The new DadConnect project starts empty. The next rebuild stage will apply a reviewed, migration-backed schema with RLS before application data is added.

Do not run the legacy seed files against the new project until the schema and auth model have been updated.
