# Project Overview

KalpTree is a multi-tenant SaaS built on Next.js (App Router) with a MongoDB backend. It includes an admin dashboard (tenant-scoped) and public website features (pages, posts, products) with per-website branding. Authentication is provided via next-auth v5, and requests are protected via Next.js middleware and RBAC utilities.

## Tech Stack
- Next.js 15 (App Router) with React 19 and TypeScript
- MongoDB (mongodb driver v7)
- Tailwind CSS v4 (utility-first styling)
- next-auth v5 (beta) for authentication
- Zod for API payload validation

## Directory Layout
- src/app
  - api: Route handlers for admin and public APIs (e.g., products, posts, pages, websites)
  - admin: Admin pages for managing products, posts, pages, tags, websites, branding
  - auth: next-auth sign-in form
  - onboarding: tenant onboarding UI
  - layout.tsx, page.tsx, globals.css
- src/components
  - ui: Shared UI primitives (button, card, input, select, dialog, table, tabs, etc.)
  - admin: Admin-specific components (DataTableExt, BrandingCustomizer, FranchiseClientManager, RoleBasedNavigation)
  - website: Public site components (Header, Footer)
- src/lib
  - db: MongoDB client and index helpers (getDatabase/getDb alias)
  - auth: next-auth configuration and helpers
  - rbac: Roles, permissions, and RBAC service
  - tenant: Tenant service utilities
  - websites: Website service (domains, branding, websiteId)
  - billing: Subscription service (stubs)
  - utils.ts, proxy.ts
- src/modules
  - ecommerce: Product/category/variant/order services and types
  - website: Page/post/media/tag services and types
- src/middleware.ts: Global middleware (auth guard; public website host->websiteId resolution)
- scripts: Seed scripts (Node/TS)
- public: Static assets
- .openhands/microagents: Microagents for OpenHands automation

## Running the Project
- Environment
  - .env.local contains:
    - NEXTAUTH_URL=http://localhost:55803
    - NEXTAUTH_SECRET=…
    - MONGODB_URI=mongodb+srv://…
    - MONGODB_DB=kalpdee
- Install deps: npm install
- Dev server: npm run dev (binds 0.0.0.0:55803)
- Build: npm run build
- Start (prod): npm run start

## Backend/Database
- MongoDB client in src/lib/db/mongodb.ts exports:
  - clientPromise
  - getDatabase(): Promise<Db>
  - getDb: alias to getDatabase for backward compatibility
- Tenancy fields:
  - Many collections include tenantId: ObjectId
  - Optional websiteId: ObjectId to restrict content to a specific website
- Index helpers: src/lib/db/indexes.ts

## Authentication & Middleware
- NextAuth instance: src/auth.ts and src/lib/auth
- Middleware: src/middleware.ts
  - Protects /admin and non-public /api routes
  - For public requests, resolves host via /api/public/websites/resolve-host and sets current_website_id cookie

## Conventions
- API route handlers live under src/app/api/**/route.ts
- Admin pages under src/app/admin/**
- Shared UI components under src/components/ui/** (use these over ad-hoc HTML/styling)
- Services should live under src/modules/** or src/lib/**; avoid DB access directly in components
- Use Zod schemas in route handlers for input validation
- All tenant-aware queries must filter by tenantId and, where applicable, websiteId

## Testing
- A Jest-style test file exists at src/tests/rbac-system.test.ts. No npm test script is configured; run via your preferred runner after setting up a test environment.



