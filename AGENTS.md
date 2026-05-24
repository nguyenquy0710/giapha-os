# Gia Phả OS - Instructions

Version: 1.1.0
Next.js 16.2.1, Supabase, Bun.

## Mandatory Rules
- Use `bun` (not npm/yarn).
- Schema: `docs/schema.sql` (critical for RLS/functions).
- Auth: Configure Supabase redirects for deployment domain.
- UI: 16px min font (iOS zoom fix).

## Commands
- `bun install`: Deps.
- `bun run dev`: Dev.
- `bun run build`: Build check.
- `bun run lint`: Lint.

## Data/Logic
- Roles: Admin (full), Editor (edit), Member (view).
- Kinship: Handles Vietnamese terms, multi-spouse, lunar dates.
- Partial dates: Supported (year-only).

## Gotchas
- No test suite, rely on ESLint + TypeScript.
- Admin: First registered user auto-promoted.
- Demo: Auto-detects `giapha-os.homielab.com`.
