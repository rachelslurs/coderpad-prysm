# Prysm Health

React + TypeScript take-home exercise. A **CNA assignment view** for a skilled-
nursing facility: a certified nursing assistant clocks in, confirms the residents
they're responsible for this shift, and documents care — meals, vitals, toileting,
repositioning — with structured inputs built for speed at the bedside.

## The three apps

After `pnpm install`, each app can be viewed on GitHub Pages or run locally:

| App | What it is | Live (GitHub Pages) | Run locally |
|---|---|---|---|
| **CNA assignment view** — `@prysm/app` | The take-home app: clock-in, assignment confirmation, a triaged resident roster, per-resident structured documentation, and batch meal logging. | https://rachelslurs.github.io/coderpad-prysm/ | `pnpm dev` → http://localhost:5173/coderpad-prysm/ |
| **Design system** — `@prysm/design-system` | Storybook catalog of the generic, context-agnostic primitives. | https://rachelslurs.github.io/coderpad-prysm/storybook/ | `pnpm storybook` → http://localhost:6006 |
| **Interview prompt builder** — `@prysm/prompt-builder` | Standalone interview aid: assembles paste-ready Claude Code prompts as you answer clarifying questions. Fully offline, persists to localStorage. | https://rachelslurs.github.io/coderpad-prysm/prompt-builder/ | `pnpm prompt-builder` → http://localhost:5180 |

All three deploy together from `main` into one GitHub Pages site via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## Stack

- React 19 + TypeScript (strict)
- pnpm workspaces + Turborepo (monorepo)
- Vite (dev + build)
- Vitest + Testing Library (jsdom)
- Tailwind v4 — semantic color tones via `@theme`
- react-aria-components — accessible form/overlay primitives
- Storybook 10 — design-system catalog

## Scripts

```bash
pnpm install
pnpm dev          # app dev server (Vite)
pnpm storybook    # design-system Storybook
pnpm prompt-builder  # interview prompt builder (Vite, :5180)
pnpm test         # run all workspace tests once
pnpm build        # typecheck + build app, Storybook, and prompt-builder
pnpm lint
```

## Layout

A monorepo: a deployable app that composes generic, context-agnostic primitives
from a design-system package.

```
app/                          — @prysm/app, the deployed Vite app
  data/
    patients.ts               — resident roster + Patient type (ADL attributes + sort signals)
    assignment.ts             — supervisor-defined assignments (named groups of residents)
    careTasks.ts              — structured documentation model (vitals/choice/meal) + log entries
  src/
    App.tsx                   — ShiftFlow: clock-in → assignment selection → in-shift shell
    main.tsx                  — entry
    components/
      ClockIn.tsx             — clock-in gate (pay starts at clock-in; separate from sign-in)
      AssignmentSelection.tsx — confirm or adjust the supervisor's assignment (friction-gated)
      NavRail.tsx             — persistent global nav (Assignment · Batch tasks · shift clock)
      ResidentSearch.tsx      — find-any-resident search, "/" to focus
      CnaAssignmentView.tsx   — triaged grid of uniform resident cards
      ResidentCard.tsx        — uniform card: identity · care icons · task-progress ring
      CareIconRow.tsx         — fixed 3-slot ADL icons (risk · transfer · continence)
      PatientView.tsx         — read-only overview ↔ structured documentation, prev/next pager
      TaskInput.tsx           — structured inputs + strike-out corrections
      BatchDocumentation.tsx  — log meal intake across residents + presence check
    lib/
      triage.ts               — tier sort (time-sensitive → clinical alert → room)
      assignment.ts           — effective roster + pending-request model
      residentDisplay.ts      — display helpers (age/sex, progress tone)
      format.tsx              — formatRoom
    state/
      shift.tsx               — ShiftProvider (clock-in, assignment, log entries)
      shiftContext.ts         — useShift hook + context

storybook/                    — @prysm/design-system, generic primitives + Storybook
  src/
    Badge/ Button/ Card/ …    — folder-per-component (component + stories + test)
    styles/theme.css          — semantic color tone tokens (@theme)
    lib/toInitials.ts         — generic helper
```

The design system ships only context-agnostic primitives (grouped in Storybook by
function: Actions, Data Display, Feedback, Overlays, Forms, Keyboard) plus the color
tones. Domain-specific components live in the app and compose those primitives —
`ResidentCard` and the census never reach for raw palette names, and the design
system has no patient knowledge.

## Notes

- **Governing principle: the assignment view is the simplest surface in the product.**
  CNAs are ~90% with patients and <10% documenting, so this view answers "what do I
  need to know, then go do the thing." Clinical depth belongs in the nurse experience,
  not here.
- **Triage is sort, not size.** Every resident card is identical; ordering alone
  encodes priority — time-sensitive task → active clinical alert (fall / elopement
  risk) → room. The criteria live in one place ([triage.ts](app/src/lib/triage.ts)),
  so changing how the floor is prioritized is a one-file change.
- **Care icons use redundant encoding.** A fixed three-slot row (risk · transfer ·
  continence) reads at a glance; each icon pairs with a hover/`title` label and
  `sr-only` text — never color alone (WCAG). Multi-person transfers carry a count
  badge (a person + "1", two people + "2").
- **Structured documentation only — no freeform text.** Segmented controls, steppers
  for vitals, and a fixed meal-item list. A read-only "normal / last recorded"
  reference is shown for context, but there's no "use last value" shortcut (that's a
  nurse-scope / HIPAA call). Vitals expose recent history for trend awareness.
- **Corrections are strike-outs, not deletes.** A logged entry can be struck with a
  structured reason; it persists on the record but stops counting and isn't shown back
  to its author (who then logs the corrected value). A CNA can strike only their own
  entries.
- **Assignment adjustments are requests, not edits.** Switching to another whole
  assignment is low-friction; adding or removing an individual resident is gated
  behind an acknowledgement that it routes to a supervisor — and it never blocks
  starting the shift.
- **Shift state lives in one context.** Clock-in, the confirmed assignment, and all
  log entries sit in [shift.tsx](app/src/state/shift.tsx), so documentation, batch
  logging, and corrections stay coherent without prop-drilling.
- **The shell never moves.** The nav rail and app bar are persistent across every
  in-shift screen; overlays follow the WCAG dialog pattern (focus management, restore
  focus on close).
