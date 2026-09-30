# DadConnect database

Project ref: `swkmxrkwjlwtauymocmg`

The active schema is tracked in `supabase/migrations/` and is designed around Supabase Auth + PostgreSQL Row Level Security.

## Initial domain model

- `profiles` — one application profile per Supabase Auth user
- `dad_groups` — public/private communities
- `group_members` — membership + owner/moderator/member roles
- `group_messages` — RLS-protected member chat
- `threads` — group discussions
- `meetups` — standalone or group-associated events
- `meetup_attendees` — RSVP state
- `sources` / `content` — read-only feed catalog
- `saves` — per-user library entries

## Integrity

Group member counts and meetup attendee counts are database-maintained through triggers rather than client-maintained counters. New Supabase Auth users receive a profile row automatically.

## Security model

All exposed tables have RLS enabled. Public access is limited to public group/discussion discovery and feed content. User-owned writes are tied to `auth.uid()`; group chat is member-only; private groups are visible only to members/creators.

The migration intentionally does not contain seed users or service-role credentials.
