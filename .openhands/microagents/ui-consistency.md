---
name: ui-consistency
agent: CodeActAgent
triggers:
  - ui-consistency
  - ui-review
---

# UI & Component Consistency

This microagent enforces repo-specific UI rules for the Next.js App Router project. It prevents design drift, enforces theming, and ensures the UI does not leak tenant or business logic.

All checks must be grounded in this repository’s code. Do not flag rules that cannot be verified.

## Design System Usage
- Use shared primitives from src/components/ui/*: Button, Card, Input, Select, Dialog, Table, Tabs, Textarea, Label, Separator, Sidebar, Avatar, Badge, Breadcrumb, Collapsible.
- Prefer these components over raw HTML with arbitrary Tailwind classes for repeated patterns.
- For admin tables and filtering UIs, prefer src/components/admin/DataTableExt and follow its patterns for sorting/filtering/pagination.

## Tenant & URL Safety
- Do NOT hardcode tenantId, websiteId, domains, or slugs in UI.
- When UI needs tenant context, get it from server auth/session helpers (src/lib/auth/session.ts -> getSession/requireAuth) or API responses, never literals.
- Do not embed absolute URLs. Use relative fetches from server components with base derived from headers (as seen in src/app/admin/*/[id]/page.tsx).

## Theming & Colors
- Tailwind v4 is used with globals.css and shadcn-style tokens. Avoid arbitrary literal colors when a tokenized class exists.
- Reuse classes consistent with the design system components. If a new color is required, extend via design tokens or component variants rather than inline hex.

## Separation of Concerns
- No DB calls or direct Mongo usage in components.
- Business logic should live in:
  - src/modules/** (ecommerce, website) services
  - src/lib/** (rbac, tenant, websites, auth)
  - Route handlers under src/app/api/** for data access
- UI components should receive data via props or via server-side fetches in page-level server components.

## Component Conventions
- Component names: PascalCase; files under src/components/** use .tsx.
- Co-locate admin “Editor” components under feature folders (e.g., src/app/admin/products/[id]/Editor.tsx).
- Prefer client components only when necessary (forms, interactivity). Mark with 'use client' at top.
- Keep server components pure; no client-only APIs.

## PR Checklist
- Uses shared components from src/components/ui/* where appropriate.
- No hardcoded tenantId/websiteId/domains/slugs.
- Colors/classes align with existing UI tokens; no arbitrary hex unless justified.
- Business logic moved to src/modules/** or src/lib/**; UI components are lean.
- Any new server component fetches derive baseUrl from headers and forward cookies as done in existing admin pages.
- Pagination/filter/sort UIs leverage DataTableExt where applicable and support dynamic field-based filters.
