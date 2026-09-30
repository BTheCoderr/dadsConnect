# DadConnect

**DadConnect is a web + mobile community platform for fathers to find local groups, coordinate meetups, share practical support, and stay connected around parenting and everyday life.**

> Status: active rebuild. DadConnect now has its own dedicated Supabase project. The database is intentionally empty while the schema and security layer are rebuilt.

## Product

DadConnect centers useful community interactions:

- local and interest-based dad groups
- group conversations
- meetups, playdates, watch parties, coffee meetups, and outdoor activities
- profiles with interests and family-stage context
- practical parenting tools
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
