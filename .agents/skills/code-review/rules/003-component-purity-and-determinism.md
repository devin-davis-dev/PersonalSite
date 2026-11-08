# RULE-003: Component Purity & Render Determinism

## Summary
To prevent React hydration mismatches in Gatsby, guarantee concurrent rendering safety in React 18, optimize garbage collection and memory usage, and keep UI predictable, all component render functions in `apps/web` must remain strictly pure and deterministic.

---

## Scope & Applicability
- **Target Files**: Files added or modified in the current working branch diff against `main`/`master` matching `apps/web/src/**/*.tsx` (components, pages, templates, layouts).
- **Diff Constraint**: Do not touch or refactor untouched legacy components outside the branch diff. Focus transformations on JSX and logic introduced or modified within the branch diff.
- **Trigger Conditions**:
  - Side effects or external mutations executed directly in the component render body (e.g. mutating external variables, invoking `window.*`, `document.*`, `localStorage`, or `setTimeout` during render).
  - Mutating incoming props, arrays, or objects in-place during render (e.g., `props.items.sort()`, `list.push()`, `delete props.key`).
  - Calling non-deterministic generators (`Math.random()`, `Date.now()`, `new Date()`) directly in the render calculation.
  - Re-instantiating static configuration objects, lookup maps, or `RegExp` literals inside the component render body on every render.
  - Redundant state synchronized via `useEffect(() => setState(...), [prop])` when the value can be computed purely on-the-fly.

---

## Core Purity Principles

### 1. Zero Render-Phase Side Effects
Render functions must be pure calculations that return JSX. Side effects (timers, DOM manipulation, storage operations, network requests, or analytics) must reside exclusively inside `useEffect`, `useLayoutEffect`, or event handlers:

#### Anti-pattern (Impure Render)
```tsx
let renderCount = 0;

export function Banner({ message }: { message: string }) {
  renderCount++; // ❌ Mutates external variable during render!
  document.title = message; // ❌ DOM side effect during render!
  
  return <Box>{message}</Box>;
}
```

#### Compliant Pattern (Pure Render)
```tsx
export function Banner({ message }: { message: string }) {
  useEffect(() => {
    document.title = message; // ✅ Side effect safely encapsulated in effect
  }, [message]);

  return <Box>{message}</Box>;
}
```

---

### 2. Immutable Prop & Data Operations
Never mutate props, state objects, or external arrays in-place. Always create shallow copies before sorting, reversing, or splicing:

#### Anti-pattern (In-Place Mutation)
```tsx
export function ProjectList({ projects }: { projects: Project[] }) {
  // ❌ Mutates incoming prop array in-place, affecting parents/subsequent renders!
  const sorted = projects.sort((a, b) => a.title.localeCompare(b.title));
  
  return (
    <ul>
      {sorted.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

#### Compliant Pattern (Immutable Copy / Memoized)
```tsx
export function ProjectList({ projects }: { projects: Project[] }) {
  // ✅ Pure, non-destructive shallow copy
  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.title.localeCompare(b.title)),
    [projects],
  );

  return (
    <ul>
      {sorted.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

---

### 3. Deterministic Rendering & Accessible IDs
Given identical props, state, and context, a component must return identical JSX. Never call `Math.random()` or non-deterministic generators during render. Use React 18's `useId()` for generating stable, SSR-safe unique element IDs:

#### Anti-pattern (Non-Deterministic Render)
```tsx
export function InputField({ label }: { label: string }) {
  // ❌ Non-deterministic: causes Gatsby SSR vs client hydration mismatches!
  const id = `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
```

#### Compliant Pattern (Deterministic with `useId`)
```tsx
export function InputField({ label }: { label: string }) {
  // ✅ Stable, deterministic across SSR and client hydration
  const id = useId();
  
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
```

---

### 4. Lifting Static Constants, Lookup Tables & RegExp
Static configuration objects, option arrays, RegExp literals, and pure calculation helpers must be lifted **outside** the component function to prevent redundant allocations and preserve referential equality:

#### Anti-pattern (Inlined Static Allocations)
```tsx
export function EmailInput() {
  // ❌ Re-allocates RegExp on every single render pass
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // ❌ Re-allocates static options array every render
  const domains = ["gmail.com", "outlook.com", "proton.me"];
  
  // ...
}
```

#### Compliant Pattern (Lifted Module-Level Constants)
```tsx
// ✅ Lifted static constants: allocated once per module
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POPULAR_DOMAINS = ["gmail.com", "outlook.com", "proton.me"];

export function EmailInput() {
  // ...
}
```

---

### 5. Pure Derived State
Do not create redundant state variables that require synchronization via `useEffect`. Compute values directly during render:

#### Anti-pattern (Redundant State Sync)
```tsx
export function FilteredList({ items, query }: FilterProps) {
  const [filtered, setFiltered] = useState<string[]>([]);

  // ❌ Redundant state and extra render cycle!
  useEffect(() => {
    setFiltered(items.filter(item => item.includes(query)));
  }, [items, query]);

  return <ul>{filtered.map(i => <li key={i}>{i}</li>)}</ul>;
}
```

#### Compliant Pattern (Pure Calculation on Render)
```tsx
export function FilteredList({ items, query }: FilterProps) {
  // ✅ Directly derived during render, zero state synchronization lag
  const filtered = useMemo(
    () => items.filter(item => item.includes(query)),
    [items, query],
  );

  return <ul>{filtered.map(i => <li key={i}>{i}</li>)}</ul>;
}
```

---

## Allowed Exceptions
- **Local Scratchpad Mutations**: Mutating local variables created and consumed strictly within the current render pass (e.g. `const rows = []; for (let i = 0; i < count; i++) { rows.push(...); }`).
- **Canvas / Animation Loops**: Canvas drawing, WebGL shaders, or requestAnimationFrame ticks in visual components (e.g., `BubbleCanvas.tsx`) where animation state updates take place inside lifecycle effects.

---

## Transformation Checklist
1. [ ] Check if the component mutates any variable defined outside its render body. Move to `useEffect` or event handlers.
2. [ ] Check if array methods `.sort()`, `.reverse()`, `.splice()` are called on props or state. Prepend `[...array]` or wrap in `useMemo`.
3. [ ] Verify that random IDs are replaced with `useId()`.
4. [ ] Identify inline `RegExp` literals, static lookup maps, or constant arrays and move them outside the component function.
5. [ ] Replace redundant `useEffect` + `setState` syncing with pure derived expressions or `useMemo`.
6. [ ] Run `pnpm run typecheck` and `pnpm run biome:lint`.
