# RULE-001: Extract Component Styles into ThemeUIStyleObject Variables

## Summary
To maintain clean, readable JSX and optimize rendering performance by avoiding object recreation on every render cycle, all non-trivial component styles in `apps/web` must be extracted into typed `ThemeUIStyleObject` variables placed outside the component render function.

---

## Scope & Applicability
- **Target Files**: Files added or modified in the current working branch diff against `main`/`master` matching `apps/web/src/**/*.tsx` (components, pages, templates, layouts).
- **Diff Constraint**: Do not touch or refactor untouched legacy components outside the branch diff. Focus transformations on JSX and styles introduced or modified within the branch diff.
- **Trigger Condition**:
  - Any element containing a multi-line inline `sx={{ ... }}` definition.
  - Any element styling that defines more than 2 CSS properties inline.
  - Component wrapper, card, button, modal, or section layout definitions.
- **Allowed Inlining (Exceptions)**:
  - Trivial 1-2 property layout hints (e.g., `sx={{ flex: 1 }}`, `sx={{ display: ["none", "block"] }}`, `sx={{ mr: 2 }}`).

---

## Standard Patterns

### 1. Static Style Objects
When styles do not depend on props or component state, define them as a `ThemeUIStyleObject` constant above the component:

```tsx
import { Box, type ThemeUIStyleObject } from "theme-ui";

const sectionWrapperStyle: ThemeUIStyleObject = {
  width: ["100%"],
  mx: "auto",
  mb: 5,
  textAlign: ["center", "left"],
};

export function ProjectSection({ children }: { children: React.ReactNode }) {
  return <Box sx={sectionWrapperStyle}>{children}</Box>;
}
```

### 2. State- or Prop-Dependent Dynamic Styles
When styles vary based on component state or props (e.g., `isOpen`, `isActive`, `variant`, `isScrolledTop`), use a typed factory function returning `ThemeUIStyleObject`:

```tsx
import { Button, type ThemeUIStyleObject } from "theme-ui";

const toggleButtonStyle = (isOpen: boolean): ThemeUIStyleObject => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  bg: isOpen ? "primary" : "secondary",
  color: isOpen ? "white" : "primary",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  "&:hover": {
    bg: isOpen ? "primary" : "rgba(41, 46, 41, 0.08)",
    color: isOpen ? "orange" : "darkOrange",
  },
});

export function ToggleCard({ isOpen }: { isOpen: boolean }) {
  return <Button sx={toggleButtonStyle(isOpen)}>Toggle</Button>;
}
```

### 3. Naming Conventions
- Suffix all style variables with `Style` (e.g., `containerStyle`, `buttonStyle`, `badgeStyle`, `contentWrapperStyle`).
- Name variables by the element's semantic role rather than its HTML tag (e.g., `headerTitleStyle` instead of `textStyle`).

### 4. File Organization & Placement
- **Standard**: Place style variables above the primary component in the same file.

---

## Transformation Checklist
1. [ ] Check if `import { type ThemeUIStyleObject } from "theme-ui"` is present. Add if missing.
2. [ ] Identify inline `sx={{ ... }}` blocks with >= 3 properties or nested selectors/pseudo-classes.
3. [ ] Extract the style block into a named variable or function above the component.
4. [ ] Replace the inline `sx={{ ... }}` with the named variable reference (`sx={myStyle}` or `sx={myStyle(state)}`).
5. [ ] Verify that no style properties or responsive array values were lost or modified during extraction.
6. [ ] Run `pnpm run typecheck` and `pnpm run biome:lint`.
