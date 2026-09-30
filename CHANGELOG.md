# Changelog

## Unreleased

### Added
- live discussions index backed by the RLS-protected threads table
- authenticated discussion composer limited to joined groups
- author and group attribution on real discussion records
- group filtering for visible discussions
- group-linked meetup planning from joined group cards and group chat
- upcoming group meetup cards inside the live chat experience
- direct meetup-to-group navigation
- complete web meetup flow with authenticated create, list, and detail screens
- Going / Maybe / Can't Go RSVP state surfaced per signed-in user
- capacity checks before accepting new Going RSVPs
- attendee lists on meetup detail pages
- member-aware group discovery using the same RLS rules as the database
- missing web group chat route with initial history, posting, and Supabase Realtime refresh
- joined/private state in shared group models and group cards
- real Supabase email/password sign-up and sign-in flow
- email-confirmation callback that exchanges auth codes for cookie-backed sessions
- persisted onboarding for kids' age ranges, interests, and opt-in city discovery
- real profile loading/editing/sign-out instead of placeholder user data
- Supabase-generated TypeScript database types shared by web and mobile clients
- typed Supabase clients so schema mismatches surface during TypeScript/build CI
- first migration-backed DadConnect domain schema for profiles, groups, chat, discussions, meetups, content, and saves
- Row Level Security policies tied to Supabase Auth ownership/membership
- automatic auth-user profile creation
- database-maintained group member and meetup attendee counts
- Realtime publication for group messages
- GitHub Actions build gate for shared TypeScript + Next.js web production build

### Changed
- meetup API accepts a group filter so group surfaces use the same RLS-protected source of truth
- meetup create form preselects a requested joined group without relying on Next.js search-param prerender hooks
- README project status now reflects the live secured schema instead of the earlier empty-database phase
- meetup list now uses the database-maintained attendee count instead of a hard-coded demo value
- meetup creation validates activity type, dates, and capacity and compensates if creator RSVP creation fails
- RSVP writes now use one conflict-safe upsert path
- groups API no longer hard-codes public visibility; RLS now decides which public/private groups a caller can see
- shared membership/message/meetup unions now match database constraints
- browser Supabase environment access now uses statically inlined NEXT_PUBLIC variables
- group and meetup APIs now rely on database-maintained counters instead of manual RPC increments
- meetup query now selects RSVP identifiers/timestamps used by the response mapper
- moved DadConnect to its own empty Supabase project in the existing organization
- replaced legacy anon-key naming with publishable-key configuration while retaining compatibility
- repaired cookie-session and mobile bearer-token Supabase client construction
- corrected API routes that were using an uninitialized or unresolved Supabase server client
- rewrote repository/setup documentation around the active rebuild

### Removed
- hard-coded demo discussion cards, fake reply counts, and placeholder author identities
- fake Google/Apple auth controls that were not connected to configured providers
- placeholder login/signup redirects and hard-coded profile identity
- legacy schema/seed SQL that targeted the retired DadConnect database
- public seed API route built around fake auth-user IDs
- unused server helper that expected a service-role key and direct Postgres URL

### Security
- moved SECURITY DEFINER RLS helpers into a non-exposed private schema
- revoked client execution from internal trigger functions
- optimized auth identity checks in RLS policies using statement-level init plans
- added missing foreign-key indexes reported by the Supabase performance advisor
- removed the stale direct Postgres credential from public environment/setup examples
- removed service-role configuration from browser/mobile setup guidance
- documented the publishable-key + RLS trust boundary
