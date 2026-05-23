# Gia Phả OS - Agent Instructions

Vietnamese family tree app (Next.js 16.2.1 + Supabase). Critical: Must use Bun (not npm/yarn).

## Commands

```bash
# Install dependencies (BUN REQUIRED)
bun install

# Development server
bun run dev

# Build for production  
bun run build

# Start production server
bun run start

# Lint code
bun run lint
```

## Tech Stack

- Next.js 16.2.1 (App Router)
- React 19.2.4, TypeScript 5.9.3
- Supabase (PostgreSQL) + @supabase/ssr
- Tailwind CSS 4.2.2 with PostCSS
- Bun package manager (mandatory, not npm/yarn)

## Key Architecture Notes

### Project Structure
- `/app` - Next.js App Router pages and layout components
- `/components` - Reusable UI components (38 components)
- `/utils` - Utility functions including Supabase helpers, date calculations, kinship logic
- `/types` - TypeScript type definitions
- `/hooks` - React hooks (e.g., pan/zoom functionality)
- `/docs` - Documentation and screenshots

### Supabase Integration
- **Auth**: User registration/login with role-based access (Admin, Editor, Member)
- **Database**: Three main tables - `persons`, `custom_events`, `user_roles`
- **Environment Variables Required**:
  ```env
  NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-anon-key"
  SITE_NAME="Gia Phả OS"
  ```

### Critical Setup Requirements
1. **Database Setup**: Must create Supabase project first, then configure auth URL redirects
2. **Package Manager**: Must use Bun (not npm/yarn) for installation
3. **First User**: Automatically gets Admin role; subsequent users get Member role by default
4. **Demo Domain**: Auto-detects `giapha-os.homielab.com` and pre-fills demo credentials

### Database Schema (docs/schema.sql)
- Core tables: `persons`, `relationships`, `custom_events`, `profiles`, `person_details_private`
- Supports partial dates (year only), lunar calendar events, avatar storage
- RLS policies: Auth users can view all, Admin/Editors can modify persons/relationships
- Admin functions: `get_admin_users()`, `set_user_role()`, `delete_user()`

### User Roles & Permissions
- **Admin**: Full system access, user management, data export/import
- **Editor**: Add/edit/delete member info and relationships
- **Member**: View-only access to family tree and statistics

### Database Constraints
- **Partial Dates**: Birth/death dates support year-only entries
- **Lunar Calendar**: Special handling for traditional Vietnamese death dates
- **Avatar Storage**: Public bucket with user upload/update permissions
- **Multi-spouse Relationships**: Supported via relationship table constraints

## Special Features

### Kinship System
- Complex Vietnamese kinship terminology (Bác, Chú, Cô, Dì...)
- Handles special cases like multi-spouse relationships
- Uses lunar calendar for traditional Vietnamese events

### Data Management
- Export/Import: JSON, CSV, GEDCOM formats
- Auto-computed events (birthdays, death anniversaries)
- Lunar calendar integration for traditional events

### UI Components
- Tree view and mindmap visualization with D3.js
- Responsive design optimized for both desktop and mobile
- iOS zoom fix for input fields (16px minimum font size)

## Development Workflow

### Testing and Validation
- ESLint only (no test suite found)
- Type checking via TypeScript
- Build verification with `bun run build`

### Database Setup
- Must run schema.sql in Supabase to create tables/functions
- Use `docs/schema.sql` for complete database initialization
- Storage buckets created automatically (avatars bucket for user images)

### Build Process
- Uses Next.js 16.2.1 with default configuration
- Static assets optimized for production
- PostCSS processing for Tailwind CSS

### Common Issues
- **Auth Errors**: Must configure Supabase auth URL redirects for deployment domain
- **Build Failures**: Ensure all environment variables are set
- **Missing Dependencies**: Use `bun install` (not npm/yarn)

## Deployment

### Vercel (Recommended)
- Use the deploy button with environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### Self-Hosting
- Requires Node.js + Bun
- Must configure Supabase auth URL for deployment domain
- Database schema must be created in Supabase first

## Privacy & Security
- No data collection by the project authors
- All data stored in user's Supabase instance
- Demo site uses fictional data only