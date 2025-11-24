Repository Summary

1) Purpose
- Multi-tenant SaaS starter focused on content/ecommerce websites with per-tenant and per-website scoping. Includes admin dashboard, public APIs, and routing by domain/subdomain. Implements media management, subscription/billing stub, and CRUD for pages, posts, products.

2) General Setup
- Node.js workspace, Next.js App Router.
- Dev server: npm run dev (served at 0.0.0.0:55803 per scripts/dev-ensure.sh). Health at /api/dev/health.
- Environment:
  - NEXTAUTH_URL=http://localhost:55803
  - NEXTAUTH_SECRET=... (set locally)
  - MONGODB_URI=mongodb+srv://... (Atlas) and MONGODB_DB=kalpdee
- Auth: NextAuth v5; middleware sets current website by host. Cookies store tenant/website context.
- UI: ShadCN components; admin tables use DataTableExt for dynamic filters, sorting, pagination.

Setup steps
- cp .env.local.example .env.local (or edit .env.local) and set values above
- npm install
- npm run dev (or use scripts/dev-ensure.sh)

3) Repository Structure
- /src
  - /app
    - /admin: Admin UI for pages, posts, products, websites, categories, orders, tags
    - /api: API routes (scoped by tenant+website) including media, pages, posts, products, subscription, websites, session, public endpoints
    - /auth: Sign-in
    - /onboarding: Tenant/website onboarding
  - /components
    - /admin: DataTableExt and related admin UI
    - /ui: ShadCN primitives
    - /website: Site components
  - /lib: db (MongoDB), auth, billing/subscription, tenant, websites services
  - /modules: ecommerce, website domain logic and types
  - /types: shared types
- /scripts: dev-ensure.sh (health-check, log rotation), other helpers
- /public: static assets
- /.github: repository docs (no workflows present)

CI/CD Workflows
- Folder .github exists, but .github/workflows is not present. No CI workflows detected at this time.

Development Guidelines
- Keep dev server stable on 55803; verify health at /api/dev/health.
- Use tenantId + websiteId scoping in APIs and admin; public routes resolve website by host.
- Admin UI should follow ShadCN “extender” design; DataTableExt provides dynamic columns/filters.
- Prefer server-side pagination/sorting for large datasets; client-side currently supported in DataTableExt.
- Before committing, ensure no tmp or rotated logs are added (see .gitignore). Commit messages should include Co-authored-by: openhands <openhands@all-hands.dev> when applicable.
