---
name: security-and-secrets
agent: CodeActAgent
triggers:
  - security-review
  - security
---

# Security & Secrets

These guardrails prevent common security issues when editing this repository.

## Secrets & Configuration
- Do not inline secrets or credentials in code. Use environment variables.
- .gitignore excludes .env* files; never commit .env.local or secrets. Verify .env* entries are respected.
- Required env variables (from repo usage):
  - NEXTAUTH_URL (e.g., http://localhost:55803)
  - NEXTAUTH_SECRET
  - MONGODB_URI (Atlas connection string)
  - MONGODB_DB (kalpdee)
- MongoDB access is centralized via src/lib/db/mongodb.ts. Use getDatabase/getDb alias; do not create ad-hoc connections.

## Logging Guidelines
- Do not log passwords, tokens, or PII. Avoid logging full request bodies.
- Prefer minimal console logging for debugging only; remove noisy logs before commit.
- There is no shared logger module in this repo; if logging is necessary in server code, consider concise console.error/info, but avoid secrets.
- Dev logs are rotated by scripts/dev-ensure.sh and ignored by .gitignore (dev-55803.log*).

## Auth & Permissions
- Authentication uses next-auth v5. Use the provided helpers instead of re-implementing auth:
  - src/auth.ts exports auth(), handlers, signIn, signOut
  - src/lib/auth/session.ts provides getSession, requireAuth, requireRole
- Middleware:
  - src/middleware.ts protects /admin and private /api routes; sets current_website_id cookie for public content.
  - src/middleware/rbac.ts offers RBAC wrappers and helpers for permission checks.
- RBAC service lives at src/lib/rbac/rbac-service.ts and should be used for permission decisions. Do not bypass it.

## Input Validation
- Use Zod for request validation in route handlers (see src/app/api/products/route.ts).
- Validate all external inputs and return 400 with details on failure: { error: 'Invalid payload', issues }.
- For public content, validate/normalize slugs and guard tenant/website context before querying.

## PR Checklist
- No secrets or tokens committed; sensitive config read from env.
- Any new route handler uses Zod for input validation and returns structured errors.
- Private APIs call auth() and enforce session.user.tenantId; RBAC checks applied if modifying privileged features.
- DB access occurs via centralized services (src/modules/** or src/lib/**) with tenantId (and websiteId when applicable) filters.
- Logging is minimal and does not leak PII/secrets.
