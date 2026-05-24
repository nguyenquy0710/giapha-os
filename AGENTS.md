# Gia Phả OS - Instructions

Version: 1.1.0
Next.js 16.2.1, Supabase, Bun.

## Mandatory Rules
- Use `bun` exclusively.
- DB Schema: `docs/schema.sql` (source of truth for RLS/functions).
- Auth: Supabase (check redirects for custom domains).
- UI: Min 16px font (prevent iOS auto-zoom).

## Commands
- `bun install`: Deps.
- `bun run dev`: Local dev server.
- `bun run build`: Build verification.
- `bun run lint`: Linting.

## Data/Logic
- Auth Roles: Admin (full), Editor (edit), Member (view).
- Kinship: Vietnamese terms, multi-spouse, lunar dates, partial dates (year-only).

## Gotchas
- No tests: Rely on strict TypeScript + ESLint.
- Admin setup: First user is auto-promoted.
- Env/Demo: Detects `giapha-os.homielab.com`.
