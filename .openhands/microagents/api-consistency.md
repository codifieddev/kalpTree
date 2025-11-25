---
name: api-consistency
agent: CodeActAgent
triggers:
  - api-consistency
  - api-review
---

# API Consistency

This repository exposes APIs via Next.js App Router route handlers under src/app/api/**. There is no Python/FastAPI backend in this codebase; all backend logic runs in Next.js server runtime using MongoDB services.

## Routing & Versioning
- API routes live under src/app/api/**/route.ts using RESTful patterns. Examples:
  - Admin/private: /api/products, /api/products/[id], /api/websites, /api/websites/current
  - Public: /api/public/products/[slug], /api/public/pages/[slug], /api/public/posts/[slug], /api/public/websites/resolve-host
  - Auth: /api/auth/[...nextauth]
- No versioned prefix (e.g., /api/v1) is currently used. Maintain existing paths and group endpoints by feature folder.
- Public endpoints are explicitly nested under /api/public/.

## Request & Response Schemas
- Use Zod in route handlers to validate and parse JSON bodies.
  - Example: src/app/api/products/route.ts defines createSchema and validates POST payloads with safeParse.
- Response structure patterns:
  - Collections: { items, meta? } (e.g., GET /api/products returns { items, meta: { total, skip, limit, hasMore } })
  - Single resource: { item } (e.g., GET /api/products/[id])
  - Errors: { error: string, issues? } with appropriate HTTP status codes
- For public content by slug, return { item } or { error }.

## Client API Layer
- There is no centralized client API wrapper. Page-level server components fetch relative URLs and forward cookies for auth/session:
  - Derive baseUrl from headers(): host/x-forwarded-host and protocol, forward cookie header from cookies().toString().
  - See src/app/admin/products/page.tsx and src/app/admin/products/[id]/page.tsx for the canonical pattern.
- Do NOT introduce ad-hoc fetches inside reusable UI components. Keep data loading in page-level server components or server actions.

## Error Handling
- Use NextResponse.json with explicit status codes:
  - 401 Unauthorized when session.user.tenantId is missing (auth()).
  - 400 Bad Request for validation errors (include issues: parsed.error.flatten()).
  - 404 Not Found when resource is absent.
  - 500 on update/delete failures when appropriate.
- Always return a JSON body with an error message on failure: { error: string }.

## Auth & Tenant Requirements
- Private/admin routes must call auth() (from src/auth.ts) and require session.user.tenantId.
- Public routes that resolve website or tenant:
  - Use cookies() to read current_website_id (set by src/middleware.ts based on host via /api/public/websites/resolve-host).
  - Derive tenantId from session.user.tenantId when available, or from headers (x-tenant-id) for public content where supported (see src/app/api/public/products/[slug]/route.ts).
- All database access must be tenant-scoped and, when applicable, also website-scoped. Use existing services:
  - src/modules/ecommerce/product-service.ts
  - src/modules/website/page-service.ts
  - src/modules/website/post-service.ts
- Preserve published/status constraints for public content (e.g., status: 'published').

## PR Checklist
- Route handlers validate inputs with Zod; no unvalidated request bodies.
- Responses follow existing patterns: { items, meta } or { item } or { error }.
- Auth checks present on private routes: auth() and session.user.tenantId enforced.
- Tenant and website scoping preserved in queries (tenantId and optional websiteId $or logic as in services).
- Page-level server components fetching follow the headers()/cookies() pattern already used in admin pages.
- Public routes guard tenant/website context and published status consistently.
