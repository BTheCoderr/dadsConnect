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
