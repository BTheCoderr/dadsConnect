# DadConnect native app release checklist

This is the Expo/React Native app in `apps/mobile`. All product development in this change is for native iOS and Android. The existing website and production database are not redeployed.

## Setup

- Install from the monorepo root with `npm ci`.
- Copy `apps/mobile/env.example` to `apps/mobile/.env` and set the DadConnect **publishable** Supabase key. Do not put secret/service-role keys in Expo client configuration.
- Set `EXPO_PUBLIC_API_URL=https://dadsconnect.netlify.app`; use a LAN IP or tunnel (not localhost) if pointing a physical phone at a local backend.
- Run `npm run typecheck:mobile` from root.
- Run `cd apps/mobile && npx expo install --check && npx expo-doctor` for compatibility.
- Run `cd apps/mobile && npx expo export --platform ios` to check Metro / Router bundling.

## Build and TestFlight

- An Expo account owner must run `cd apps/mobile && npx eas-cli init` to register a real project ID. No temporary or invented EAS project ID is used.
- Review the bundle identifier and app icon before registering the Apple app.
- In `apps/mobile`, run `npx eas-cli build --platform ios --profile preview` for private-device QA or `npx eas-cli build --platform ios --profile production --auto-submit` after QA, Apple credentials, and App Store Connect are configured.
- Test two real accounts: sign-up/confirmation, session recovery, feed/saves, create/join groups, matching group chat, realtime messages, create/RSVP meetups, account privacy, and sign-out/relogin.
- A GitHub TypeScript pass, Expo export, or merged PR does not imply a successful signed device build or TestFlight upload.

Native app icons and Apple signing credentials still need the approved brand artwork and owner's Apple/Expo configuration.


## Mobile account and community safety requirements

- The iOS and Android screens now include profile editing, password recovery, account deletion, message reports, and member hiding/unhiding.
- In Supabase Auth URL Configuration, allow `dadconnect://reset-password` as an additional redirect URL. Test reset emails from a physical device. Without this allowlist the recovery flow cannot complete.
- The safety migration `supabase/migrations/20261013181136_mobile_safety_controls.sql` was applied to the existing DadConnect database and RLS verified. Apply it when provisioning any new environment. Hiding an author filters their messages from mobile group chat but does not remove them from shared groups.
- A qualified community administrator must review `public.safety_reports` from a privileged dashboard and respond to abuse reports. Those rows are private to their reporter under RLS, never public.
- Server-side account deletion requires `SUPABASE_SERVICE_ROLE_KEY` configured on the server host. **Never** expose it as `EXPO_PUBLIC_` or `NEXT_PUBLIC_`.
- Account deletion requires a fresh password verification plus typing DELETE. It removes the user's login, owned meetups and groups, and dependent records. Real-device and staging tests with disposable accounts are required before release. Deletion of shared owned content can affect other members.
- Confirm backend restoration and live HTTPS API connectivity; passing Metro builds alone is not a backend integration test.

### Native QA

Use two disposable test accounts to verify:
1. Sign up and confirm email, log in, log out, reopen app and restore session.
2. Reset password by following an email link on both iOS and Android.
3. Edit bio/interests and confirm public vs private profile separation.
4. Join a group and chat, report another member's message, hide them, then unhide.
5. Confirm reported records are visible only to the reporter and an administrator.
6. Create a meetup, RSVP on a second account and verify limits.
7. Save/un-save, read/unread, and verify no cross-account content leaks.
8. Delete one disposable account; confirm it can no longer log in and its owned content is removed.
9. Check all flows while offline, after session expiration, and after reopening the app.

**App Store readiness remains gated on approved artwork, EAS/Apple signing, a real TestFlight build, privacy disclosures, moderation operations, and completing these tests.**

## October 13 beta-branch integration

This mobile beta branch includes the newer Expo SDK 54 configuration and safety flows. The old SDK 53 dependency tree and `.github/workflows/mobile-bundle.yml` from the main branch are intentionally superseded by `.github/workflows/dadconnect-mobile-ci.yml`.

Mobile reliability updates: avoid treating temporary session-read failures as sign-out, preserve the requested group when opening chat, ignore stale message responses from a previously selected group, and separate pull-to-refresh from feed pagination. These updates are code and bundle tested, not physical-device validated.

The beta branch can be reviewed and merged only after confirming the backend safety migration, Apple/EAS identifiers, store artwork, privacy handling, and end-to-end tests listed above.
