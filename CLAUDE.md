# Project Guidelines

## Monorepo Architecture

This repository is a `pnpm` workspace monorepo:

- **`apps/web`**: Gatsby 5 frontend portfolio website.
- **`packages/contracts`**: Smart contracts workspace powered by Hardhat and OpenZeppelin.

### Common Commands (from root)

- `pnpm run develop`: Start Gatsby development server (`http://localhost:8000`)
- `pnpm run build`: Build Gatsby production site
- `pnpm run test`: Run frontend unit tests with Jest
- `pnpm run test:contracts`: Run smart contract unit tests with Hardhat
- `pnpm run build:contracts`: Compile Solidity contracts with Hardhat
- `pnpm run test:e2e`: Run Playwright end-to-end tests
- `pnpm run biome:lint`: Run Biome linter across the entire monorepo
- `pnpm run biome:fix`: Auto-fix Biome formatting/linting issues
- `pnpm run typecheck`: Run TypeScript type checking for the web app

## Internationalization (i18n)

This site supports English and French. When making any changes that involve user-facing text:

- Add translations to both `apps/web/locales/en/` and `apps/web/locales/fr/` JSON files
- Use `useTranslation` from `gatsby-plugin-react-i18next` and `t()` calls instead of hardcoded strings
- Shared translations (used across multiple pages/components) go in `common.json`
- Page-specific translations go in their respective namespace file (e.g., `projects.json`, `index.json`)
