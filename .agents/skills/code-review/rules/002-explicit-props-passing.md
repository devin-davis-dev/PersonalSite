# RULE-002: Explicit Props Passing (Disallow JSX Props Spreading)

## Summary
To prevent unintentional DOM attribute leakage, eliminate silent prop or style overwrite bugs, preserve explicit component interfaces, and maintain strong TypeScript contracts, all component props in `apps/web` must be explicitly declared, destructured, and passed to underlying JSX elements rather than forwarded using spread syntax (`{...props}` or `{...rest}`).

---

## Scope & Applicability
- **Target Files**: Files added or modified in the current working branch diff against `main`/`master` matching `apps/web/src/**/*.tsx` (components, pages, templates, layouts).
- **Diff Constraint**: Do not refactor untouched legacy components outside the branch diff. Focus enforcement and transformations strictly on JSX elements introduced or modified within the branch diff.
- **Trigger Condition**:
  - Any JSX element or component using JSX spread attribute syntax: `<Element {...props} />`, `<Element {...rest} />`, `<Box {...otherProps} />`.
  - Spreading generic prop objects into child components or HTML primitives.
- **Allowed Exceptions**:
  1. **Form Library Bindings**: Spreading properties returned by `react-hook-form`'s `register()` (e.g., `<Input {...register("email")} />` or `<Textarea {...messageRegisterRest} />`).
  2. **Test Suites & Mocks**: Test files (`*.test.tsx`, `*.spec.tsx`) and mock fixtures (`__mocks__/**`) where test objects or mock props are forwarded into rendered components.
  3. **MDX Runtime Bridges**: Dynamic markdown AST element interceptors (e.g., in `short-codes.ts` or `Layout.tsx`'s MDX component map) where incoming AST attributes are inherently dynamic and heterogeneous.

---

## Standard Patterns

### 1. Component Props Destructuring
Declare an explicit interface for component props and destructure the required properties in the component parameter list:

#### Anti-pattern (Invalid Spreading)
```tsx
interface CardProps {
  title: string;
  className?: string;
  [key: string]: any;
}

// ❌ Bad: Leaks arbitrary props to DOM and hides prop contract
export function Card(props: CardProps) {
  return (
    <Box sx={cardStyle} {...props}>
      {props.title}
    </Box>
  );
}
```

#### Compliant Pattern (Explicit Props)
```tsx
interface CardProps {
  title: string;
  id?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

// ✅ Good: Clear contract, explicit forwarding, zero DOM pollution
export function Card({
  title,
  id,
  className,
  onClick,
  children,
}: CardProps) {
  return (
    <Box
      id={id}
      className={className}
      onClick={onClick}
      sx={cardStyle}
    >
      <Text as="h3">{title}</Text>
      {children}
    </Box>
  );
}
```

### 2. Forwarding Common HTML / Accessibility Attributes
When a component wraps a native button, input, or link, explicitly destructure and pass standard HTML/accessibility attributes rather than spreading `...rest`:

```tsx
export interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

export function ActionButton({
  label,
  onClick,
  disabled = false,
  type = "button",
  ariaLabel,
}: ActionButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || label}
      sx={actionButtonStyle}
    >
      {label}
    </Button>
  );
}
```

### 3. Separation of Styling Props from DOM Attributes
Do not spread props across `sx` style objects. Keep styles managed via typed `ThemeUIStyleObject` variables (per [RULE-001](./001-theme-ui-style-variables.md)) and pass structural props explicitly:

```tsx
// ✅ Good: Styles cleanly extracted, props explicitly mapped
export function Reference({ id, children, className }: ReferenceProps) {
  const { activeRefId } = useCitation();
  const cleanId = id.replace(/^#/, "").replace(/^ref-/, "");
  const isHighlighted = activeRefId === cleanId;

  return (
    <Box
      as="li"
      id={`ref-${cleanId}`}
      data-highlighted={isHighlighted ? "true" : undefined}
      className={className}
      sx={referenceItemStyle(isHighlighted)}
    >
      {children}
    </Box>
  );
}
```

---

## Transformation Checklist
1. [ ] Identify any `<Element {...spread} />` expression in modified diff hunks.
2. [ ] Check if the file meets an allowed exception (`react-hook-form` `register`, test suite, or dynamic MDX AST bridge).
3. [ ] If non-exempt, inspect which properties in the spread object are actually needed by the underlying element or child component.
4. [ ] Declare those attributes explicitly on the component's TypeScript `interface` or `type`.
5. [ ] Destructure the properties explicitly in the component function parameters.
6. [ ] Replace the `{...props}` or `{...rest}` spread with explicit attribute assignments (e.g., `id={id}`, `className={className}`, `onClick={onClick}`).
7. [ ] Run `pnpm run typecheck` and `pnpm run biome:lint`.
