---
name: ui-consistency
type: lint
version: 1.0.0
agent: CodeActAgent
# This microagent has no automatic triggers. Invoke it manually when needed.
---

# UI & Component Consistency Guidelines

This microagent ensures consistency across all UI components and application layouts in the multitenant SaaS project. It prevents design drift, enforces theming rules, and ensures the UI does not leak tenant-specific or business logic.

All checks performed by this microagent must rely on facts derived from the existing source code. If the agent cannot confirm the rule from the codebase, it must not flag an issue.

---

## Best Practices for UI Consistency

1. **Use Shared Design System Components**  
   Always prefer shared UI components (e.g., `Button`, `Card`, `Input`) instead of raw styling or repeated patterns.  
   This ensures visual consistency and reduces duplication.

2. **Avoid Hardcoded Tenant or URL Values**  
   UI files must not contain:  
   - `tenantId`, `businessId`, or `franchiseId` as literal strings  
   - absolute URLs (e.g., `https://domain.com/api/...`)  
   All tenant-aware values must come from context, hooks, or utilities.

3. **Maintain Theme / Whitelabel Consistency**  
   Avoid static color usage such as `bg-red-500`, `text-blue-600`, etc.  
   Use theme tokens or CSS variables to support multi-tenant theming.

4. **Separate UI from Business Logic**  
   UI components must never contain:  
   - DB queries  
   - direct API calls  
   - server-side utilities  
   - business rule computations  
   Such logic should live in `modules`, `lib`, or server actions.

5. **Follow Component Conventions**  
   - Component names must use PascalCase  
   - Props must be typed with interfaces/types  
   - No tenant-specific assumptions should be hardcoded  
   - Folder structure must align with `src/components` and `src/app` conventions

---

## UI Review Process

1. Scan all affected files under `src/components` and `src/app`.
2. Verify usage of:
   - shared UI components  
   - theme variables  
   - layout patterns defined in the project  
3. Flag any hardcoded identifiers or URLs.
4. Confirm separation of UI rendering and application logic.
5. Provide clear comments in PRs with explanation and recommended fix.
6. Do not raise issues unless supported by patterns in the existing codebase.

---

## Enforcement Principles

- Do not guess rules — only enforce patterns visible in the repository.
- Do not enforce subjective style choices.
- Do not make assumptions about tenant hierarchy logic in UI code.
- Always prioritize design consistency and theme safety.
- Only report issues grounded in verifiable code evidence.
