# Changelog

## Unreleased

### Added
- GitHub Actions build gate for shared TypeScript + Next.js web production build

### Changed
- moved DadConnect to its own empty Supabase project in the existing organization
- replaced legacy anon-key naming with publishable-key configuration while retaining compatibility
- repaired cookie-session and mobile bearer-token Supabase client construction
- corrected API routes that were using an uninitialized or unresolved Supabase server client
- rewrote repository/setup documentation around the active rebuild

### Security
- removed the stale direct Postgres credential from public environment/setup examples
- removed service-role configuration from browser/mobile setup guidance
- documented the publishable-key + RLS trust boundary
