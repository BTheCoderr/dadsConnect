# DadConnect

<!-- repo-intro:start -->
**Project snapshot:** DadConnect is a web + mobile community platform for fathers built around groups, conversations, real-world meetups, RSVP coordination, profiles, saved content, and a community-aware feed.

**What it demonstrates:** Next.js · Expo/React Native · TypeScript workspaces · Supabase Auth/Postgres/RLS/Realtime · shared authorization across web and mobile.
<!-- repo-intro:end -->

<!-- portfolio-refresh:start -->
<p align="center">
  <img src="./apps/web/public/dad-and-child-work.png" alt="DadConnect community visual" width="720" />
</p>

## Product at a glance

| Area | Current build |
| --- | --- |
| Surfaces | Next.js web + Expo/React Native mobile |
| Community | Groups, member chat, longer-form discussions |
| Meetups | Create events, group-linked planning, Going/Maybe/Can't Go RSVPs, capacity handling |
| Discovery | Community-aware feed, groups, discussions, meetups |
| Profiles | Public community profile + separately protected private family/location context |
| Saved library | Account-backed saved content with read/unread state and source links |
| Backend | Dedicated Supabase project with RLS + generated TypeScript database types |

### Current rebuild direction

DadConnect is no longer being treated as a static community mockup. The current work is building a real **groups → conversations → meetup → RSVP → feed/profile** loop on one shared authorization model across web and mobile.
<!-- portfolio-refresh:end -->

**DadConnect is a web + mobile community platform for fathers to find local groups, coordinate meetups, share practical support, and stay connected around parenting and everyday life.**

> Status: active rebuild. DadConnect has its own dedicated Supabase project with the reviewed schema live, RLS enabled on all exposed tables, and a clean Supabase security advisor.

## Product

DadConnect centers useful community interactions:

- local and interest-based dad groups
- group conversations with member-only Realtime chat plus RLS-protected longer-form group discussions
- authenticated meetup creation, detail pages, capacity-aware Going / Maybe / Can't Go RSVPs, plus group-linked meetups that can be planned directly from a community
- profiles with interests and family-stage context
- community-aware feed combining first-party/content-source reading with live discussions, meetups, and group discovery
- account-backed saved library with persistent read/unread state, source links, sharing, and deletion
- web and mobile clients backed by one authorization model

## Architecture

| Layer | Stack |
| --- | --- |
| Web | Next.js 15 + React 18 |
| Mobile | Expo + React Native |
| Shared code | TypeScript workspace package |
| Auth / database | Supabase Auth + PostgreSQL |
| Authorization | Postgres Row Level Security |
| Database typing | Supabase-generated TypeScript schema types |
| Repository | npm workspaces monorepo |

The frontend receives only the Supabase **publishable key**. Privileged database credentials do not belong in this repository or in browser/mobile bundles.

### Dedicated Supabase project

- project name: `DadConnect`
- project ref: `swkmxrkwjlwtauymocmg`
- region: `us-east-1`

This project is separate from the other applications in the same Supabase organization.

## Repository layout

```text
dadsConnect/
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
│   └── shared/
├── setup.md
└── package.json
```

## Local setup

```bash
npm install
cp apps/web/env.example apps/web/.env.local
cp apps/mobile/env.example apps/mobile/.env
npm run dev:web
```

See [setup.md](setup.md) for environment details.

## Rebuild plan

1. isolate DadConnect in its own Supabase project
2. remove stale privileged connection examples
3. repair server/mobile session handling
4. redesign the Postgres schema and RLS policies
5. add migrations, generated types, tests, and CI
6. validate web/mobile flows against the live project
7. keep generated database types synchronized with applied migrations

## Authentication flow

Web signup/login now uses Supabase Auth directly. Group discovery is RLS-driven, signed-in membership state is returned by the groups API, joined members can use live group chat backed by Supabase Realtime, and authenticated dads can create meetups and manage capacity-aware RSVPs. Email confirmations return through `/auth/callback`, new Auth users automatically receive a profile row, and onboarding persists family-stage interests and optional city discovery preferences under RLS.

The UI intentionally exposes only email/password auth until an OAuth provider is actually configured. Feed ranking uses the signed-in profile's interests when content exists, while discussions, groups, and upcoming meetups are loaded from live RLS-protected data.

## Profile privacy

Community-facing profiles contain name, avatar, bio, and interests. Family-stage age ranges and optional location preferences live in a separate `profile_private` row protected by owner-only RLS. Member profile pages never query that private table.

## Security principles

- client applications use a publishable key, never a service-role key
- user-owned writes are authorized with RLS and `auth.uid()`
- authorization never trusts user-editable metadata
- UPDATE policies include both row visibility and write checks
- schema changes are migration-backed and reviewed
- demo data never depends on fake auth-user IDs

## Commands

```bash
npm run dev:web
npm run dev:mobile
npm run build:web
npm run build
npm run typecheck
```

---

DadConnect is being rebuilt as a production-style community application and portfolio project, with each significant engineering change documented in Git history.
