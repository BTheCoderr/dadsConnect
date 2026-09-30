# DadConnect database

The active Supabase project is intentionally empty while the replacement schema is designed and reviewed.

Project ref: `swkmxrkwjlwtauymocmg`

The legacy schema and seed files were removed because they mixed stale assumptions, fake auth-user IDs, and an older Supabase project configuration.

The replacement database work will be introduced as reviewed migrations with:

- explicit RLS on every exposed table
- `auth.uid()` ownership and membership checks
- no service-role key in browser/mobile code
- indexed authorization columns
- generated TypeScript database types
- CI/schema verification before app data is loaded
