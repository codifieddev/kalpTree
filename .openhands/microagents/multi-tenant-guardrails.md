---
name: multi-tenant-guardrails
agent: CodeActAgent
triggers:
  - multi-tenant
  - tenant-guard
  - tenant-review
---

# Multi-tenant Guardrails

These rules ensure tenant isolation and consistent handling of tenant-scoped data across APIs, services, and UI.

## Tenant Context Sources
- Auth/session via next-auth:
  - src/auth.ts exports auth(); helpers in src/lib/auth/session.ts (getSession, requireAuth).
- Middleware:
  - src/middleware.ts protects /admin and private /api, and resolves website by host for public pages. It sets the `current_website_id` cookie via /api/public/websites/resolve-host.
- RBAC:
  - src/lib/rbac/rbac-service.ts enforces permissions and logs activity.

## Query & Data Access Rules
- Collections are tenant-scoped using tenantId: ObjectId.
- When applicable, also scope by websiteId: ObjectId (content tied to a specific website). This pattern is used in:
  - src/modules/ecommerce/product-service.ts (getBySlugForWebsite, listProducts, getById)
  - src/modules/website/page-service.ts (getBySlugForWebsite, getById, listPages)
  - src/modules/website/post-service.ts (getBySlugForWebsite, getById, list)
- All read/write queries MUST include tenantId filters. Example:
  - Products: { tenantId: new ObjectId(tenantId), ... }
  - Optionally include websiteId constraint: { $or: [{ websiteId: wid }, { websiteId: { $exists: false } }] }
- Do not perform cross-tenant queries unless explicitly in a super-admin context guarded by RBAC.
- In RBAC paths using getDb/getDatabase, always include tenantId in filters for user-owned resources.

## API & UI Guidelines
- API route handlers under src/app/api/** must resolve tenant from session (auth()) and enforce tenant checks before DB access.
- Public APIs that derive website content must also read current_website_id cookie when joining content to websites (e.g., public products/pages/posts routes).
- UI must never hardcode tenantId, websiteId, or domains. Obtain tenant/website context via:
  - Server components using headers/cookies (await cookies(), await headers()) and session.
  - Responses from server APIs that already enforce tenant filters.
- When editing queries or adding new ones, preserve tenantId and websiteId conditions and respect published/status fields when serving public content.

## PR Checklist
- Tenant context resolved via auth() and/or middleware-provided cookies.
- All DB queries include tenantId; public content also guards status (e.g., status: 'published').
- Website-aware content either filters by websiteId or allows global content with { $exists: false } logic as seen in services.
- No hardcoded tenant IDs/domains/slugs in code.
- RBAC-protected endpoints verify permissions before actions (see src/lib/rbac/rbac-service.ts and src/middleware/rbac.ts if used).
