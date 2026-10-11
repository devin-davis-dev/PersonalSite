# Verification Runbook & Quality Gates

Every feature, bugfix, or refactoring in this repository must satisfy the following verification checks before completion.

---

## 1. Quick Verification Commands (From Root)

Run the entire verification suite:
```bash
pnpm run typecheck && pnpm run test && pnpm run biome:lint && pnpm run build
```

Individual checks:
- **TypeScript Typecheck**:
  ```bash
  pnpm run typecheck
  ```
  Runs `tsc --noEmit` in `apps/web`. Must output 0 errors.

- **Frontend Unit Tests (Jest)**:
  ```bash
  pnpm run test
  ```
  Runs all Jest unit test suites (`*.test.tsx`) under `apps/web`.

- **Smart Contract Tests (Hardhat)**:
  ```bash
  pnpm run test:contracts
  ```
  Runs Hardhat tests under `packages/contracts`.

- **Biome Linter & Formatter**:
  ```bash
  pnpm run biome:lint
  ```
  Checks formatting, organize-imports, and lint rules across the repository.

- **Auto-Fix Formatting/Linting**:
  ```bash
  pnpm run biome:fix
  ```
  Applies safe and unsafe fixes for formatting and import sorting.

- **Gatsby Production Build**:
  ```bash
  pnpm run build
  ```
  Compiles production bundles and renders all 96+ static HTML pages.

- **E2E Tests (Playwright)**:
  ```bash
  pnpm run test:e2e
  ```

---

## 2. Common Gotchas & Solutions

1. **Theme UI Breakpoints & Responsive Arrays**:
   When using array notation for responsive props (e.g., `width: ["100%", "80%"]`) in objects passed to `sx`, ensure the object is typed with `ThemeUIStyleObject` from `theme-ui`.

2. **Babel Preset Compatibility**:
   `apps/web` uses Babel 7 (`@babel/preset-typescript@^7`). Do not upgrade `@babel/preset-typescript` to v8, as v8 is incompatible with Gatsby 5's internal Babel 7 pipeline.

3. **Jest Matchers in Unit Tests**:
   `apps/web/tsconfig.json` includes `@testing-library/jest-dom` in `compilerOptions.types`. If DOM matchers like `toBeInTheDocument()` are missing, ensure this type entry is present.

4. **Gatsby Cache Invalidation**:
   If Gatsby build throws cache or GraphQL schema errors after altering query shapes, clean cache:
   ```bash
   pnpm run clean
   ```
