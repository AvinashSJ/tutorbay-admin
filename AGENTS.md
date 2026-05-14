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
- **Phase 3 — RTK Query integration**:
  - Added Redux infrastructure: `src/lib/redux/store.ts`, `src/lib/redux/hooks.ts`, `src/app/StoreProvider.tsx`
  - Added base API slice: `src/lib/redux/api/baseApi.ts` with `fetchBaseQuery` pointing to `/api/admin`
  - Added 6 API slices: `usersApi`, `paymentsApi`, `matchesApi`, `requirementsApi`, `subscribersApi`, `dashboardApi`
  - Added 6 API routes (BFF layer): `/api/admin/users`, `/api/admin/payments`, `/api/admin/matches`, `/api/admin/requirements`, `/api/admin/subscribers`, `/api/admin/dashboard`
  - Updated `src/app/layout.tsx` to wrap with `<StoreProvider>`
  - Requires `npm install @reduxjs/toolkit react-redux` before building
- **Phase 4 — Code quality**:
  - **`router-compat.jsx` removed from production code**: Created `src/components/AppLink.tsx` — clean TypeScript component wrapping `next/link` with `to`/`href` compatibility + hash link handling. Migrated 3 production files (MasterLayout, Breadcrumb, RouteScrollToTop) to import from AppLink. `router-compat.jsx` is now a 2-line re-export shim for backward compat with 93 template files.
  - **Error boundary**: Added `src/components/ErrorBoundary.tsx` — generic class component with retry button. Wraps `{children}` in MasterLayout so page crashes don't break sidebar/header.
  - **Shared RPC types**: Created `src/lib/types/supabase.ts` with `PipelineStats`, `MatchRow`, `PaymentRow`, `SubscriberRow`, `TimelineEvent`. Removed duplicate inline interfaces from 7 files (MatchOverview, PipelineStatsWidget, PaymentTable, SubscriberTable, SessionTimeline, MatchList). Updated 3 page files + 4 API slices to import from shared types.
- **Phase 5 — Database pagination optimization**:
  - **SQL migration scripts**: Created `scripts/rpc-admin-get-all-payments-paginated.sql`, `scripts/rpc-admin-get-all-matches-paginated.sql`, `scripts/rpc-admin-get-subscribers-paginated.sql` — add `p_page`/`p_limit` params to admin RPCs with `LIMIT`/`OFFSET`. User must review/adjust table names before running in Supabase SQL Editor.
  - **6 API routes updated**: All `GET` handlers now accept `?page=N&limit=N` query params (defaults: page=1, limit=20). Response format changed to `{ data: [...], total: number }`.
  - **Requirements route** (`api/admin/requirements`): Uses native `.range()` + `.select(..., { count: 'exact' })` for true DB-level pagination. Match counts query filtered to only paged IDs via `.in("requirementId", ids)`.
  - **RPC-based routes** (payments, matches, subscribers): Fetch all via RPC then slice server-side (fallback until SQL migrations are run). Still returns correct `total` count.
  - **Users route** (`api/admin/users`): Fetches all from Auth Admin API, slices server-side, returns `total`.
  - **4 RTK Query endpoint types changed**: `usersApi`, `paymentsApi`, `requirementsApi`, `subscribersApi` — return `{ items: T[]; total: number }` instead of raw `T[]`. Accept optional `{ page?: number; limit?: number }` args. Backward compatible: `useGetXxxQuery()` with no args uses defaults.
  - **Matches API type changed**: `matchesApi.getMatches` returns `{ stats, matches, total }` instead of `{ stats, matches }`. Accepts pagination args.
  - **Shared type**: Added `PaginatedResult<T>` interface to `src/lib/types/supabase.ts`.
