# RULE-005: Named Component Exports & Explicit Component File Naming

## Summary
To prevent naming inconsistencies across import sites, eliminate ambiguous IDE search results (avoiding dozens of tabs named `index.tsx`), optimize bundle tree-shaking, and prevent circular barrel-file dependencies, all components in `apps/web/src/components/` must use **named exports exclusively** and live directly in **explicitly named files matching the component name**, with `index.ts` / `index.tsx` component barrels disallowed.

---

## Scope & Applicability
- **Target Files**: Component files, layouts, and hooks matching `apps/web/src/components/**/*.tsx` (and `apps/web/src/layouts/**/*.tsx`, `apps/web/src/hooks/**/*.ts*`).
- **Diff Constraint**: Enforced on components and files added, modified, or reviewed within the active scope.
- **Trigger Conditions**:
  - Any component exporting via `export default ...`.
  - Consumers importing components using default import syntax: `import MyComponent from "./MyComponent"`.
  - Any barrel file named `index.ts` or `index.tsx` located inside `apps/web/src/components/` used merely to re-export or define components.
- **Allowed Exceptions**:
  1. **Gatsby Pages** (`apps/web/src/pages/**/*.tsx`): Gatsby page routing architecture requires a `default export` for the page component.
  2. **Gatsby Templates** (`apps/web/src/templates/**/*.tsx`): Gatsby's `createPage` API in `gatsby-node.ts` instantiates templates requiring a `default export`.
  3. **Third-Party Integrations / Config Bridges**: Specific configuration bridges or dynamic loader scripts where external contracts explicitly require a default export (e.g. `gatsby-config.ts`, `gatsby-node.ts`, `short-codes.ts`).

---

## Standard Patterns

### 1. Named Component Exports
Always export component functions or variables using named export syntax directly at declaration:

#### Anti-pattern (Default Export)
```tsx
// ❌ Bad: Default export permits arbitrary, inconsistent naming across files
function ProjectCard({ project }: ProjectCardProps) {
  return <Card>{project.title}</Card>;
}

export default ProjectCard;

// In consumer:
import CustomCard from "./ProjectCard"; // Inconsistent naming drift
```

#### Compliant Pattern (Named Export)
```tsx
// ✅ Good: Explicit, uniform named export
export function ProjectCard({ project }: ProjectCardProps) {
  return <Card>{project.title}</Card>;
}

// In consumer:
import { ProjectCard } from "./ProjectCard"; // Strict, searchable, refactor-friendly
```

---

### 2. Explicit Component File Naming (Disallowing `index.ts` / `index.tsx`)
Components must be placed in a file named after the component itself, never hidden behind generic `index.ts` or `index.tsx` barrel files.

#### Anti-pattern (Component Index Barrel)
```
apps/web/src/components/
  Collapsible/
    index.ts          <-- ❌ VIOLATION: generic index re-export barrel
    Collapsible.tsx
  BookCard/
    index.tsx         <-- ❌ VIOLATION: component implemented in generic index file
```

#### Compliant Pattern (Direct Component File)
```
apps/web/src/components/
  Collapsible/
    Collapsible.tsx   <-- ✅ Clear file identity in IDE tabs & fuzzy finders
    Collapsible.test.tsx
  BookCard/
    BookCard.tsx      <-- ✅ Directly named component file
    BookCard.test.tsx
```

Consumers import directly from the component file:
```tsx
// ✅ Direct, unambiguous import
import { Collapsible } from "../components/Collapsible/Collapsible";
import { BookCard } from "../components/BookCard/BookCard";
```

---

### 3. Forward Ref Components
When wrapping components in `React.forwardRef`, assign to a named constant and export it:

```tsx
export const ProjectDialog = forwardRef<ProjectDialogHandle, ProjectDialogProps>(
  ({ title, projects }, ref) => {
    return <dialog ref={ref}>...</dialog>;
  },
);

ProjectDialog.displayName = "ProjectDialog";
```

---

## Motivation & Benefits
1. **Zero "Index Tab Hell"**: Developers working on multiple components simultaneously avoid having 10 open editor tabs all titled `index.tsx`.
2. **Refactoring & Symbol Rename Safety**: Renaming a named export in TypeScript automatically updates all import sites across the monorepo via IDE AST refactoring tools. Default exports cannot be refactored with the same confidence.
3. **No Circular Dependencies / Tree-Shaking Drag**: Barrel `index.ts` files frequently cause circular dependency issues and pull unintended modules into bundles during Webpack tree-shaking.
4. **Searchability**: Searching for symbol `ProjectCard` in files immediately links to `ProjectCard.tsx` rather than an ambiguous `index.ts`.

---

## Transformation Checklist
1. [ ] Check if the file is an exempt Gatsby page or template. If exempt, preserve the default export.
2. [ ] Identify any `export default ComponentName` or `export default function ...`.
3. [ ] Convert to `export function ComponentName(...)` or `export const ComponentName = ...`.
4. [ ] Identify any `index.ts` or `index.tsx` inside component directories.
5. [ ] Update all consumer import sites across the codebase to import the named component directly from the named component file: `import { ComponentName } from ".../ComponentName/ComponentName"`.
6. [ ] Delete the unnecessary `index.ts` / `index.tsx` component barrel file.
7. [ ] Run `pnpm run typecheck`, `pnpm biome:lint`, and `pnpm test`.
