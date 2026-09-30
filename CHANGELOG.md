# Changelog

## Unreleased

### Added
- first migration-backed DadConnect domain schema for profiles, groups, chat, discussions, meetups, content, and saves
- Row Level Security policies tied to Supabase Auth ownership/membership
- automatic auth-user profile creation
- database-maintained group member and meetup attendee counts
- Realtime publication for group messages
- GitHub Actions build gate for shared TypeScript + Next.js web production build

### Changed
- group and meetup APIs now rely on database-maintained counters instead of manual RPC increments
- meetup query now selects RSVP identifiers/timestamps used by the response mapper
- moved DadConnect to its own empty Supabase project in the existing organization
- replaced legacy anon-key naming with publishable-key configuration while retaining compatibility
- repaired cookie-session and mobile bearer-token Supabase client construction
- corrected API routes that were using an uninitialized or unresolved Supabase server client
- rewrote repository/setup documentation around the active rebuild

### Removed
- legacy schema/seed SQL that targeted the retired DadConnect database
- public seed API route built around fake auth-user IDs
- unused server helper that expected a service-role key and direct Postgres URL

### Security
- removed the stale direct Postgres credential from public environment/setup examples
- removed service-role configuration from browser/mobile setup guidance
- documented the publishable-key + RLS trust boundary
