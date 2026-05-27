# Gia Phả OS - Instructions
Version: 1.1.1
Next.js 16.2.6, Supabase, Bun.

## Mandatory Rules
- Use `bun` exclusively. It's already configured in `package.json`.
- DB Schema: `docs/schema.sql` is the source of truth for schema, RLS policies, and custom functions.
- Auth: Supabase; on deploy, add your domain to **Authentication → URL Configuration → Redirect URLs** with `**` wildcard (e.g., `https://your-site.com/**`).
- UI: Minimum 16px font globally (via `.next/font`) to prevent iOS auto-zoom.

## Commands
- `bun install`: Install dependencies.
- `bun run dev`: Start the local dev server.
- `bun run build`: Build for production.
- `bun run start`: Start the production server locally.
- `bun run lint`: Run ESLint (no separate typecheck command; included).
- `bun run deploy`: Deploy via `npx wrangler pages deploy .next` (used in CI).

## Data/Logic
- Auth Roles: Admin, Editor, Member; managed via Supabase and RLS.
- Admin setup: First user auto-promoted via `handle_new_user()` DB trigger.
- User data: Email confirmation for first user is auto-handled by `handle_first_user_confirmation()` DB trigger.
- Kinship: Vietnamese terms, multi-spouse, lunar dates, year-only partial dates.
- Sensitive data (phone, residence) is in `person_details_private` table with RLS.

## Gotchas
- No tests; quality relies on strict TypeScript (`tsconfig.json`) and ESLint (`eslint.config.mjs`).
- Deployment: On Vercel or Cloudflare Pages; redirect URL setup is mandatory post-deploy.
- UI: Avatars and gallery use Supabase storage; RLS policies control upload/view access.
- Database: Use `schema.sql` as the single source of truth. All auth triggers, RLS policies, and custom admin RPC functions (e.g., `admin_create_user`) are defined there.
