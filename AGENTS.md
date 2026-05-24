# Gia Phả OS - Instructions
Version: 1.1.0
Next.js 16.2.1, Supabase, Bun.

## Mandatory Rules
- Use `bun` exclusively.
- DB Schema: `docs/schema.sql` (source of truth for RLS/functions).
- Auth: Supabase; check redirects for custom domains.
- UI: Minimum 16px font (prevent iOS auto‑zoom).

## Commands
- `bun install`: Install deps.
- `bun run dev`: Start dev server.
- `bun run build`: Build verification.
- `bun run lint`: Linting.

## Data/Logic
- Auth Roles: Admin (full), Editor (edit), Member (view).
- Kinship: Vietnamese terms, multi‑spouse, lunar dates, year‑only partial dates.

## Gotchas
- No tests; rely on strict TypeScript + ESLint.
- Admin setup: First user auto‑promoted.
- Env/Demo: Detects `giapha-os.homielab.com`.
