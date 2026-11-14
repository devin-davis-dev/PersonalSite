# Monorepo & System Architecture

This repository is structured as a `pnpm` workspace monorepo with two primary packages:

```text
PersonalSite/
├── apps/
│   └── web/                   # Gatsby 5 + React 18 + TypeScript frontend
├── packages/
│   └── contracts/             # Hardhat + Solidity + OpenZeppelin smart contracts
├── biome.json                 # Monorepo-wide code style & linter configuration
├── CLAUDE.md                  # Development guidelines & command cheat sheet
├── netlify.toml               # Netlify deployment configuration
├── package.json               # Monorepo root scripts & dev dependencies
└── pnpm-workspace.yaml        # Workspace package topology
```

---

## 1. Frontend: `apps/web`

### Technology Stack
- **Framework**: Gatsby 5.16 (`gatsby`, `gatsby-plugin-image`, `gatsby-plugin-mdx`, `gatsby-plugin-sharp`)
- **Runtime**: React 18.3 (`react`, `react-dom`)
- **Language**: TypeScript 7.0 (`tsc --noEmit` via `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`, `"jsxImportSource": "theme-ui"`)
- **Styling**: Theme UI 0.17 (`theme-ui`, `@theme-ui/components`, `@theme-ui/prism`) with `@emotion/react`
- **Internationalization**: `gatsby-plugin-react-i18next` with `i18next` and `react-i18next`
- **Unit Testing**: Jest 29 + `@testing-library/react` + `@testing-library/jest-dom` + `babel-jest`
- **E2E Testing**: Playwright (`@playwright/test`)
- **Serverless Functions**: Netlify Functions (`apps/web/netlify/functions/`)

### Key Directories
- `src/pages/`: File-system routes (`index.tsx`, `about.tsx`, `projects.tsx`, `blog.tsx`, `posts.tsx`, `contact.tsx`, `climbing.tsx`, `404.tsx`).
- `src/templates/`: Programmatic dynamic page templates instantiated by `gatsby-node.ts`:
  - `BlogPostPage.tsx`: Individual MDX blog posts.
  - `ProjectPage.tsx`: Individual MDX project case studies with GitHub commit logs.
  - `CategoryPage.tsx`: Tagged/categorized project listings.
- `src/components/`: Reusable UI components, modals (`dialogs/`), navigation (`app/Navbar.tsx`, `app/SideNav.tsx`, `app/Footer.tsx`), SEO (`Seo/Seo.tsx`), charts (`SkillsChart/`, `TechBreakdownChart/`).
- `src/layouts/`: Layout wrappers (`PageWrapper.tsx`, `Layout.tsx`).
- `src/theme/`: Theme UI design tokens, colors, breakpoints, font styles (`theme.ts`, `components.ts`).
- `src/types/`: Canonical TypeScript interfaces (`index.ts`).
- `content/`: Local MDX files and structured JSON data (`blog/`, `projects/`, `books.json`, `tech_logos/`).
- `locales/`: i18n JSON files for `en` and `fr`.

### Gatsby Build Lifecycle
- `gatsby-config.ts`: Configures plugins, metadata, source filesystems, feed, manifest, and i18n languages (`defaultLanguage: "en"`, `languages: ["en", "fr"]`).
- `gatsby-node.ts`: Queries all MDX nodes, generates language-prefixed slugs (via `slugify`), fetches GitHub commits for projects at build time, and calls `actions.createPage` for posts, projects, and categories.
- `gatsby-browser.tsx`: Client-side lifecycle hooks, global CSS imports (`prismjs.css`, `fonts.css`), and scroll restoration.

---

## 2. Contracts Package: `packages/contracts`

### Technology Stack
- **Framework**: Hardhat 2.22 (`hardhat`, `@nomicfoundation/hardhat-toolbox`)
- **Contracts**: Solidity 0.8.x with `@openzeppelin/contracts`
- **Scope**: Smart contract primitives (e.g., `Donate.sol`) for Web3 interactions.

### Key Commands
- Compile: `pnpm --filter contracts compile`
- Test: `pnpm --filter contracts test`
