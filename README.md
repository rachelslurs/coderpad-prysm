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
    PatientCensus.tsx     — search + sortable roster (swaps to detail on row click)
    PatientCensus.test.tsx
    PatientDetail.tsx     — single-patient view with status-tinted hero
    StatusBadge.tsx       — Critical / Needs Attention / Stable
  test/                   — Vitest setup
```

## Notes

- `PatientCensus` derives the visible list in render from `(PATIENTS, searchQuery, sort)` rather than storing filtered/sorted rows in state — single source of truth, no effect-sync.
- Sort state is `{ key, dir }` as one cohesive value so toggle transitions stay atomic.
- Row accent (left border) on the first `<td>` pairs with `StatusBadge` for redundant encoding — color alone would be a WCAG fail.
- Detail panel follows the WCAG dialog pattern: focus the close button on open, restore focus to the originating row on close.

## With more time

_This section (and the README itself) was written after the timer was up — consolidating the inline "would do differently" notes left in the code during the exercise. Some code edits were also made after the timer, not during the exercise:_
- _The "hide patient name" toggle in the roster header._
- _Keyboard activation on rows (see **Keyboard / focus** below) — Enter / Space to open the detail panel._

Things I'd do differently, gathered from inline notes:

**Sorting** — [PatientCensus.tsx:220-230](src/components/PatientCensus.tsx#L220-L230)
- Status needs a semantic comparator, not lexical. `String(...).localeCompare(...)` lands Critical / Needs Attention / Stable in triage order by alphabet coincidence — add "Discharged" and it sorts between Critical and Needs Attention, which is clinically wrong. Right shape: `STATUS_RANK: Record<Patient["status"], number>` driving numeric compare.
- Default the page to status-desc so the charge nurse lands on Critical first. Held off because it's opinionated and the fixture's room-asc happens to be the natural eye-path.
- Per-column comparator map: age sorts as string today (fine at 2 digits, breaks at 100+); room is alphanumeric and wants natural-order; `admittedOn` wants Date compare. One `comparators[key]` lookup replaces the `localeCompare` default.

**Roster UI** — [PatientCensus.tsx:231-235](src/components/PatientCensus.tsx#L231-L235)
- Dedicated search input with clear button.
- Sticky `<thead>` once row count justifies it.
- Dark-mode variants to match `App`'s `dark:bg-zinc-950`.
- Map the `<th>` columns from a config array to kill header duplication if the column set grows.

**Keyboard / focus** — [PatientCensus.tsx:236-241](src/components/PatientCensus.tsx#L236-L241)
- ARIA grid pattern with roving tabindex + arrow-key row navigation. Today every row is a tab stop (Enter / Space opens the panel); with N rows that's N tab stops to cross the table. Grid pattern would collapse to one tab stop with arrow keys between rows.
- Focus trap inside the detail panel (Tab cycles within it). Skipped under timer; with one focusable element in the panel it's a non-issue today.

**Detail layout** — [PatientCensus.tsx:85-90](src/components/PatientCensus.tsx#L85-L90)
- Explore a split-pane that physically separates roster and detail, instead of the current master-detail swap.

**Fixture data** — [PatientDetail.tsx:19-21](src/components/PatientDetail.tsx#L19-L21)
- Seed `admittedOn` from `now - N days` so the "Day N" cue reads at realistic magnitudes. Current fixture dates are 2024, so numbers read large.
