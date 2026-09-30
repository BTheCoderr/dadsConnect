# Changelog

## Unreleased

### Added
- live mobile Feed tab with cursor pagination, source opening, and real saved-item writes
- live mobile Library with persistent read/unread, delete, share, and source opening
- mobile email/password sign-in and sign-up backed by Supabase Auth
- live mobile Groups, Meetups, Realtime group chat, and account profile screens
- mobile TypeScript gate in GitHub Actions CI
- persistent library read/unread updates through owner-scoped save records
- real saved-content deletion, source opening, Web Share, and clipboard fallback
- save timestamps and content URLs in library responses for correct sorting and actions
- editable public profile identity with real account activity counts
- safe member profile route exposing only community-facing fields
- profile UI that clearly separates public identity from self-only family/location preferences
- self-only profile_private table for kids' age ranges and optional location preferences
- compatibility trigger that redirects legacy profile privacy-field writes into the private table
- community-aware feed sections backed by live discussions, meetups, groups, and saved-item count
- interest/topic-aware content ranking using the current content schema
- idempotent real save writes from feed content
- source links in article summaries instead of simulated article bodies
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
- signed-in mobile routing now lands on Feed as the product home
- shared API helper handles 204 responses and exposes typed saved-library update/delete contracts
- mobile TypeScript configuration now resolves the app-local `@/*` alias used by Expo routes
- Expo config now imports its public config type from `expo/config`
- mobile API requests now attach the current Supabase access token instead of using mock fallbacks
- groups API now returns the database-maintained member count instead of a hard-coded value
- /api/me now returns owner-only private profile data and live account activity counts for the signed-in user
- mobile root routing now sends signed-out users to sign-in and signed-in users to real tabs
- login and onboarding now read/write the self-only profile_private table directly
- generated database types refreshed after the profile privacy migration
- shared ContentItem model and ranker now match the live Supabase content table
- feed content API joins real source names and keeps optional profile-interest personalization
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
- old standalone mobile Feed and Library routes outside the authenticated tab flow
- obsolete mobile `/groups` and `/pods` routes left over from the pre-tab mock application
- Austin mock groups and meetups, fake mobile chat messages, John Dad profile data, and fake mobile profile stats
- library demo sorting by UUID, alert-only sharing, local-only read toggles, and fake delete behavior
- hard-coded feed activity counts, fake suggested groups, fake trending topics, and lorem-ipsum article content
- console-only/local-only feed save behavior
- hard-coded demo discussion cards, fake reply counts, and placeholder author identities
- fake Google/Apple auth controls that were not connected to configured providers
- placeholder login/signup redirects and hard-coded profile identity
- legacy schema/seed SQL that targeted the retired DadConnect database
- public seed API route built around fake auth-user IDs
- unused server helper that expected a service-role key and direct Postgres URL

### Security
- moved family-stage and location preference data out of the community-readable profile surface
- revoked direct authenticated profile inserts; Auth provisioning remains the canonical profile creation path
- moved SECURITY DEFINER RLS helpers into a non-exposed private schema
- revoked client execution from internal trigger functions
- optimized auth identity checks in RLS policies using statement-level init plans
- added missing foreign-key indexes reported by the Supabase performance advisor
- removed the stale direct Postgres credential from public environment/setup examples
- removed service-role configuration from browser/mobile setup guidance
- documented the publishable-key + RLS trust boundary
