# Prysm Health

React + TypeScript take-home exercise. Renders a patient census with search, sort, and a detail panel.

## The three apps

After `pnpm install`, each app can be viewed on GitHub Pages or run locally:

| App | What it is | Live (GitHub Pages) | Run locally |
|---|---|---|---|
| **Patient census** — `@prysm/app` | The take-home app: patient census with search, sort, and a detail panel. | https://rachelslurs.github.io/coderpad-prysm/ | `pnpm dev` → http://localhost:5173/coderpad-prysm/ |
| **Design system** — `@prysm/design-system` | Storybook catalog of the generic, context-agnostic primitives. | https://rachelslurs.github.io/coderpad-prysm/storybook/ | `pnpm storybook` → http://localhost:6006 |
| **Interview prompt builder** — `@prysm/prompt-builder` | Standalone interview aid: assembles paste-ready Claude Code prompts as you answer clarifying questions. Fully offline, persists to localStorage. | https://rachelslurs.github.io/coderpad-prysm/prompt-builder/ | `pnpm prompt-builder` → http://localhost:5180 |

All three deploy together from `main` into one GitHub Pages site via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## Stack

- React 19 + TypeScript
- pnpm workspaces + Turborepo (monorepo)
- Vite (dev + build)
- Vitest + Testing Library (jsdom)
- Tailwind v4 — semantic color tones via `@theme`
- Storybook 10 — design-system catalog

## Scripts

```bash
pnpm install
pnpm dev          # app dev server (Vite)
pnpm storybook    # design-system Storybook
pnpm prompt-builder  # interview prompt builder (Vite, :5180)
pnpm test         # run all workspace tests once
pnpm build        # typecheck + build the app and Storybook
pnpm lint
```

## Layout

A monorepo: a deployable app that composes generic, context-agnostic primitives
from a design-system package.

```
app/                          — @prysm/app, the deployed Vite app
  data/patients.ts            — fixture data + Patient type
  src/
    App.tsx                   — app shell
    main.tsx                  — entry
    components/
      PatientCensus.tsx       — dark command bar + sortable roster (opens detail on row click)
      PatientDetail.tsx       — single-patient overlay, three-tier hierarchy (Clinical / Care / Admin)
      StatusBadge.tsx         — status → tone + icon over the design-system <Badge/>
    lib/format.tsx            — domain helpers (formatRoom, calculateLOS)

storybook/                    — @prysm/design-system, generic primitives + Storybook
  src/
    Badge/ Button/ Card/ …    — folder-per-component (component + stories + test)
    styles/theme.css          — semantic color tone tokens (@theme)
    lib/toInitials.ts         — generic helper
```

The design system ships only context-agnostic primitives (grouped in Storybook by
function: Actions, Data Display, Feedback, Overlays, Keyboard) plus the color
tones. Patient-specific components live in the app and compose those primitives.

## Notes

- `PatientCensus` derives the visible list in render from `(PATIENTS, searchQuery, sort)` rather than storing filtered/sorted rows in state — single source of truth, no effect-sync.
- Sort state is `{ key, dir }` as one cohesive value so toggle transitions stay atomic.
- Row accent (4px inset `box-shadow` on the first `<td>`) pairs with `StatusBadge` for redundant encoding — color alone would be a WCAG fail. Using a shadow instead of `border-l-4` so the body cells stay aligned with the no-border thead.
- Detail panel follows the WCAG dialog pattern: focus the close button on open, restore focus to the originating row on close.
- Rows are focusable `<tr>` + `onKeyDown`, not `role="button"` — applying button semantics to a `<tr>` overrides the table role and collapses the cell-by-cell screen-reader read into one button label. The ARIA grid pattern is the fuller answer; see "With more time."

## With more time

_This section was written after the timer; some code edits were also made post-timer:_
- _Hide-names toggle in the roster header — privacy gesture for shoulder-surf contexts (rounds, visitors). A global toggle isn't the right shape for every scenario (emergency / handoff want names visible); per-role visibility is the production answer._
- _Keyboard activation on rows — Enter / Space opens the detail panel. Implementation rationale (`<tr>` + `onKeyDown`, no `role="button"`) lives in **Notes** above._

### Next sprint, in order

1. **Typed comparator map for sort — finish what status started.** `STATUS_RANK` now drives the status sort numerically — `Discharged` could land anywhere alphabetically and triage rank stays correct. Three more columns sit on the same `localeCompare` default and want the same treatment: Patient (currently sorts by first name because the stored value is "First Last", but clinical convention is last-name first), Age (string compare breaks at 100+), and Room (alphanumeric wants natural-order). One per-key `comparators[key]` lookup replaces the default in [compareBy](app/src/components/PatientCensus.tsx). *First because it's correctness, not polish.*

2. **ARIA grid pattern on the roster — roving tabindex + arrow keys.** Charge nurses drive this view keyboard-heavy across a full shift. Today every row is its own tab stop (Enter / Space opens), so traversing the table is N tab stops. Grid pattern collapses that to one tab stop with arrows moving between rows. *Second because it's working today — but the user the tool exists for is the one for whom "working" is the lowest bar.* — row implementation at [PatientCensus.tsx](app/src/components/PatientCensus.tsx) `tbody` map.

### When this scales

_Today: 8-patient fixture, in-memory. The hardening shipped (memoized `visiblePatients`, lifted `.toLowerCase()`) covers actual per-render cost. The items below are sited comments in [PatientCensus.tsx](app/src/components/PatientCensus.tsx) today — they become work when the data shape changes, not before. Listed in the order they typically arrive._

1. **Server-side sort + filter.** When patients live in a database, sort and filter move to the query (`ORDER BY`, `WHERE name ILIKE`, indexed sort columns). The comparator map becomes the API contract (`?sort=room:asc`). Client gets debounce + `AbortController` on the search input. *First because every other item assumes a round-trip exists.*

2. **Real-time updates with stable sort.** Census data is live — admits, discharges, status changes stream in. Naive re-sort on every update reorders rows under the user's cursor. Paired fixes: stable secondary key (id) so equal-key rows don't shuffle, and freeze sort while a row is focused or the detail panel is open. *Second because the day a row jumps mid-click is the day they stop trusting the tool.*

3. **Multi-column sort.** Charge nurses sort status desc, then room asc, in one view. `sort` becomes `Array<{key, dir}>`, `compareBy` walks the array and returns on first non-zero. Header click adds/promotes; shift-click appends; small numeric badge per active column. *Third because it's a real workflow but only useful once the data layer keeps up.*

4. **Virtualization, not pagination.** At ~200 rows the inlined row map is a measurable reconciliation cost. For a bounded view (one ward = ~30-60 beds, scanned not paginated) virtualize rather than paginate. Pair with extracting `<PatientRow />` + `React.memo` (see the comment at the `tbody` map). Likely move from `<table>` to `role="grid"` divs so sticky-header stays clean — same shape the ARIA grid pattern in Next Sprint already wants. *Fourth because it's the largest refactor and the one most likely to be wrong if done before there's real data to measure against.*

### Backlog (polish, not load-bearing)

_Listed roughly in order of user-impact, not effort._

- DOB visible on the row — hover over the age column, or a small caption beneath. Disambiguates same-name patients for right-patient verification; age alone doesn't.
- `<th>` columns from a config array if a 5th sortable column lands.
