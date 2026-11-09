# Project Agent Guidelines

## Verification & Scripts
Run these exact single commands from the repository root (all are pre-approved in `settings.json`):

- **Typechecking:** `pnpm run typecheck`
- **Linting & Formatting:** `pnpm biome:lint`
- **All Tests:** `pnpm test`
- **Smart Contract Tests:** `pnpm test:contracts`
- **Single Test File:** `pnpm test <relative/path/to/file.test.ts>`

## Workflow Constraints
- Do not run `pnpm install`, `pnpm add`, or `pnpm dlx` without explaining why a new dependency is required first.
- After modifying TypeScript or Solidity files, run `pnpm biome:lint` and the relevant test script (`pnpm test` or `pnpm test:contracts`) before finishing the task.
- For monorepo sub-packages, run scripts from the root using `pnpm --filter <package-name> <script>` rather than `cd`-ing into the package directory.

