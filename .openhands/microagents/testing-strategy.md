---
name: testing-strategy
agent: CodeActAgent
triggers:
  - add-tests
  - test-review
---

# Testing Strategy

This repository currently contains a Jest-based test file at src/tests/rbac-system.test.ts. There is no configured npm test script and no FastAPI/Python tests in this codebase.

## Frontend/Node Tests
- Framework: Jest (imports from @jest/globals are used in src/tests/rbac-system.test.ts).
- Scope: Unit tests around RBAC roles and branding validation by mocking the MongoDB layer.
- Location: src/tests/*.test.ts (example: rbac-system.test.ts)
- Naming: *.test.ts

## Backend Tests
- No Python/FastAPI backend exists in this repo; backend logic is implemented in Next.js route handlers and service classes (TypeScript). Add tests in TypeScript accordingly.

## When to Add Tests
- Bug fix: add or update at least one failing test first that reproduces the bug.
- New feature: include unit tests for core logic (e.g., service classes in src/modules/** or src/lib/**).
- Integration tests: if you introduce test tooling, target key API flows under src/app/api/** using request/response mocks.

## Test Layout & Naming
- Place unit tests under src/tests/ with pattern *.test.ts.
- Co-locate new test utilities under src/tests/ if needed.

## Running Tests
- No npm test script is currently defined. To run Jest tests, you can:
  - Add a script: "test": "jest" (and configure Jest), or
  - Use ts-node/tsx to run node-based tests after adding the required dev dependencies.
- Until test infra is added, treat tests as reference/specs. Do not rely on CI running them.

## PR Checklist
- Add at least one test for any bug fix or critical feature.
- Tests live under src/tests/ and follow *.test.ts naming.
- Tests mock MongoDB and external services; avoid hitting real databases.
- Keep tests deterministic and independent of environment-specific secrets.
