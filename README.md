# Prysm Health

React + TypeScript take-home exercise. Renders a patient census with search, sort, and a detail panel.

## Stack

- React 19 + TypeScript
- Vite (dev + build)
- Vitest + Testing Library (jsdom)
- Tailwind v4

## Scripts

```bash
npm install
npm run dev        # start dev server
npm run test       # run tests once
npm run test:watch # watch mode
npm run build      # typecheck + production build
npm run lint
```

## Layout

```
data/
  patients.ts             — fixture data + Patient type
src/
  App.tsx                 — app shell
  main.tsx                — entry
  components/
    PatientCensus.tsx     — search + sortable roster + detail panel
    PatientCensus.test.tsx
    StatusBadge.tsx       — Critical / Needs Attention / Stable
  PatientsTable.tsx       — earlier sortable table iteration
  test/                   — Vitest setup
```

## Notes

- `PatientCensus` derives the visible list in render from `(PATIENTS, searchQuery, sort)` rather than storing filtered/sorted rows in state — single source of truth, no effect-sync.
- Sort state is `{ key, dir }` as one cohesive value so toggle transitions stay atomic.
- Row accent (left border) on the first `<td>` pairs with `StatusBadge` for redundant encoding — color alone would be a WCAG fail.
- Detail panel follows the WCAG dialog pattern: focus the close button on open, restore focus to the originating row on close.
