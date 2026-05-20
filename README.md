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
- Rows are focusable `<tr>` + `onKeyDown`, not `role="button"` — applying button semantics to a `<tr>` overrides the table role and collapses the cell-by-cell screen-reader read into one button label. The ARIA grid pattern is the fuller answer; see "With more time."

## With more time

_This section was written after the timer; some code edits were also made post-timer:_
- _Hide-names toggle in the roster header — privacy gesture for shoulder-surf contexts (rounds, visitors). A global toggle isn't the right shape for every scenario (emergency / handoff want names visible); per-role visibility is the production answer._
- _Keyboard activation on rows — Enter / Space opens the detail panel. Implementation rationale (`<tr>` + `onKeyDown`, no `role="button"`) lives in **Notes** above._

### Next sprint, in order

1. **Typed comparator map for sort — status first.** `String(...).localeCompare(...)` runs every column through one lexical compare. Status is the clinical failure mode: add "Discharged" and it sorts between Critical and Needs Attention, which is wrong every shift. Age (string compare breaks at 100+) and room (alphanumeric wants natural-order) are latent in this fixture but on the same code path. *First because it's correctness, not polish — and one refactor fixes all three.* — [PatientCensus.tsx:42-47](src/components/PatientCensus.tsx#L42-L47)

2. **ARIA grid pattern on the roster — roving tabindex + arrow keys.** Charge nurses drive this view keyboard-heavy across a full shift. Today every row is its own tab stop (Enter / Space opens), so traversing the table is N tab stops. Grid pattern collapses that to one tab stop with arrows moving between rows. *Second because it's working today — but the user the tool exists for is the one for whom "working" is the lowest bar.* — [PatientCensus.tsx:181-197](src/components/PatientCensus.tsx#L181-L197)

### Backlog (polish, not load-bearing)

- DOB visible on the row — hover over the age column, or a small caption beneath. Disambiguates same-name patients for right-patient verification; age alone doesn't.
- Dark-mode variants in `PatientCensus` to match the app shell.
- Sticky `<thead>` once the row count justifies it.
- Dedicated search input with a clear button.
- `<th>` columns from a config array if a 5th sortable column lands.
