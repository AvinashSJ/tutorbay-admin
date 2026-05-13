# Tutorbay Admin — Project Notes

## Deployment
- Render Web Service via `render.yaml` (name: `tutorbay-admin`)
- Node 20, build: `npm install && npm run build`, start: `npm start`
- Env vars to set in Render dashboard: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Changes Made
- **Login page** (`src/app/auth/login/page.tsx`): Removed "Next.js App Router" text, changed to "Tutorbay superadmin dashboard built with Supabase."
- **Root layout** (`src/app/layout.tsx`): Removed Geist fonts (Next.js default), updated favicon to custom `/assets/images/favicon.png`, metadata title → "Tutorbay Superadmin", description → "Tutorbay superadmin dashboard"
- **Logout**: Added `/api/auth/signout` route (GET + POST) that signs out via Supabase server client and redirects to `/auth/login`. Logout button placed in two locations:
  - **Sidebar** (bottom): red Log Out button
  - **Profile dropdown** (top-right): Log Out button using fetch POST
