# CLAUDE.md

## What this is
A React 19 + TypeScript take-home exercise, structured as a pnpm-workspace
monorepo with **three deployable apps** plus a shared design system. All three
build together and deploy to one GitHub Pages site from `main`.

| Workspace | Package | What it is |
|---|---|---|
| `app/` | `@prysm/app` | The take-home app — a patient census with search, sort, and a detail panel. Deployed at the Pages root. |
| `storybook/` | `@prysm/design-system` | Storybook catalog of generic, context-agnostic UI primitives. Consumed by the other two as source via `workspace:*`. |
| `prompt-builder/` | `@prysm/prompt-builder` | Standalone interview aid: assembles paste-ready Claude Code prompts from clarifying-question answers. Fully offline, persists to `localStorage`. |

## Project layout
pnpm workspace monorepo (`pnpm@10.27.0`, Node ≥20, see `.nvmrc`). Turborepo
(`turbo.json`) orchestrates `build` / `test` / `dev` across workspaces. The
design system is consumed by `app` and `prompt-builder` via `workspace:*` **as
source** (not a built artifact) — see "Styling" for the Tailwind `@source`
implication.

```
app/                          — @prysm/app, the deployed Vite app
  data/patients.ts            — fixture data + Patient type — DO NOT MODIFY (marked in-file)
  src/
    App.tsx, main.tsx         — shell + entry
    components/
      PatientCensus.tsx       — dark command bar + sortable roster (row click → detail)
      PatientDetail.tsx       — single-patient overlay, three-tier hierarchy
      StatusBadge.tsx         — status → tone + icon, composed over <Badge/>
    lib/format.tsx            — domain helpers (formatRoom, calculateLOS)

storybook/                    — @prysm/design-system, generic primitives + Storybook
  src/
    Badge/ Button/ Card/ …    — folder-per-component (component + index + stories + test)
    styles/theme.css          — semantic color tone tokens (@theme) — the color contract
    styles/tokens.css         — Storybook's Tailwind entry
    lib/toInitials.ts         — generic helpers
    types.ts                  — shared types (e.g. Tone)
    Overview.mdx,
    ChoosingAComponent.mdx    — prose guides (component-selection docs)

prompt-builder/               — @prysm/prompt-builder, standalone interview aid
  src/
    answers.ts                — question/answer model
    prompt.ts                 — templating engine (conditional blocks)
    persistence.ts            — localStorage
    components/               — QuestionsPane, OutputPane, QuestionCard, …
```

## Commands
Run from the repo root:

```bash
pnpm install
pnpm dev             # @prysm/app dev server (Vite) → http://localhost:5173/coderpad-prysm/
pnpm storybook       # design-system Storybook → http://localhost:6006
pnpm prompt-builder  # interview prompt builder (Vite) → http://localhost:5180
pnpm test            # all workspace tests once (turbo run test)
pnpm build           # typecheck + build app, Storybook, and prompt-builder
pnpm lint            # eslint . (flat config)
```

Per-workspace scripts exist too (e.g. `pnpm --filter @prysm/app test:watch`).

## Architecture conventions
- **The design system ships only generic, context-agnostic primitives.** No
  domain (patient) knowledge lives in `@prysm/design-system`. Components are
  named and documented for *any* consumer (`Badge`, `EntityRow`, `EntityCard`,
  not `PatientBadge`). Domain-specific components live in `app/` and **compose**
  the primitives (e.g. `StatusBadge` wraps `<Badge/>`; the census composes
  `AppBar`, `TextInput`, `ColumnHeader`, etc.).
- **Primitives are grouped in Storybook by function**, not by domain: Actions,
  Data Display, Feedback, Overlays, Navigation, Forms, Keyboard. The public API
  is the single barrel `storybook/src/index.ts` (every component re-exported
  with its `*Props` type).
- **Accessibility is load-bearing**, not an afterthought. Redundant encoding
  (color + icon + text, never color alone — WCAG), WCAG dialog focus management
  in overlays, semantic table markup. Read the app's `README.md` "Notes" and
  "With more time" sections before changing roster/detail interaction behavior.

## Styling — Tailwind v4 + semantic tones
- **Tailwind v4** via `@tailwindcss/vite`. No `tailwind.config.js`; configuration
  is CSS-first.
- **Color is semantic.** Components style by *meaning* — one of six `Tone`s
  (`neutral`, `accent`, `info`, `success`, `warning`, `danger`) — never by raw
  palette names (`rose`, `slate`, …). The contract lives in
  `storybook/src/styles/theme.css` (`@theme static`); re-skinning a tone is a
  one-line change there and every consumer follows. The `Tone` type is exported
  from the design system.
- **Tone class strings must be written as whole literals** (see the
  `Record<Tone, string>` maps in `Badge.tsx`). Tailwind only generates classes
  it can see statically — never build tone class names by string interpolation.
- **Each consumer has its own Tailwind entry** (`app/src/index.css`,
  `prompt-builder/src/index.css`, `storybook/src/styles/tokens.css`). Because the
  design system is consumed as source, each entry must `@import` the shared
  `theme.css` **and** `@source "../../storybook/src"` so Tailwind scans the
  primitives and generates their utility classes. If a design-system component's
  styles go missing in a consumer, check the `@source` line.
- Canvas font is **Figtree** (imported per entry); neutral spine is a
  "cooled-toward-blue" slate.

## Testing
- **Vitest + Testing Library** (jsdom) across all workspaces. Tests are
  co-located: `Foo.test.tsx` beside `Foo.tsx`. Setup files at
  `<workspace>/src/test/setup.ts`.
- **The design system also runs its Storybook stories as real browser tests**
  via `@storybook/addon-vitest` (Playwright/Chromium). `storybook/vitest.config.ts`
  defines two projects: a jsdom project and a `storybook` browser project. CI
  installs Chromium before `pnpm test`. Locally, `playwright install chromium`
  is needed for the browser project to run.
- Configs `passWithNoTests: true`, so an empty workspace won't fail the suite.

## Storybook MCP (component docs & story tools)
The `@storybook/addon-mcp` addon is configured in
[storybook/.storybook/main.ts](storybook/.storybook/main.ts) and registered as a
project MCP server in [.mcp.json](.mcp.json) at `http://localhost:6006/mcp`.
(`main.ts` also pins docgen to `react-docgen-typescript` so the MCP returns full
props/JSDoc for complex intersection prop types — don't switch it back to the
default `react-docgen`.)

**The MCP tools only work while the Storybook dev server is running.** Start it
from the repo root with `pnpm storybook` (serves on port 6006).

When working on `@prysm/design-system` components or stories, prefer the
Storybook MCP tools over guessing:
- `list-all-documentation` — discover available component/docs IDs (pass
  `withStoryIds: true` when you need story IDs).
- `get-documentation` / `get-documentation-for-story` — retrieve props, usage,
  variants. **Never invent props or variants** — look them up; if undocumented,
  say so.
- **Caveat:** `get-documentation` returns props + stories but NOT a component's
  `parameters.docs.description.component` (the "when to use / when not to" prose).
  For component-*selection* decisions, read that from the story `meta` or the
  component's Docs tab — don't rely on `get-documentation` alone.
- `get-storybook-story-instructions` — call before creating/editing components
  or stories (framework-specific import & story patterns).
- `preview-stories` — call after changing a component/story; include the returned
  preview URLs in your response.
- `run-story-tests` — run the Vitest-backed story tests after changes; fix
  failures before reporting done.

## Authoring a design-system component
Follow the existing folder-per-component shape (`storybook/src/Badge/` is the
reference):
- `Foo.tsx` (default export + named `FooProps` type, JSDoc on each prop),
  `index.ts` (re-export component + props), `Foo.stories.tsx`, `Foo.test.tsx`.
- Add the export to the barrel `storybook/src/index.ts` under the right group.
- Story `meta` carries a `parameters.docs.description.component` blurb with
  **When to use / When not to use** prose (this is what drives component
  selection — see the caveat above). Register cross-references in
  `ChoosingAComponent.mdx` when adding a new primitive.
- Structured form inputs (`Toggle`, `Segmented`, `Stepper`, `Select`,
  `TextInput`, `TextArea`, `FormField`) are built on **react-aria-components**.
- Style with semantic tone utilities and whole-literal class maps (see Styling).

## Conventions & tooling
- **Conventional Commits**, enforced by commitlint (`@commitlint/config-conventional`)
  via a Husky `commit-msg` hook. Use `type(scope): summary`
  (e.g. `feat(design-system): …`, `fix(Stepper): …`, `docs: …`).
- **ESLint flat config** (`eslint.config.js`): JS + typescript-eslint
  recommended, react-hooks, react-refresh, and storybook plugin rules.
  `react-refresh/only-export-components` is disabled for `*.stories.*` and
  `.storybook/**` (they legitimately export non-component values).
- **TypeScript strict** everywhere (`tsconfig.base.json`): `strict`,
  `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
  `react-jsx`, bundler resolution.
- **`app/data/patients.ts` is fixture data marked `DO NOT MODIFY`** — treat the
  `Patient` type and the fixtures as fixed inputs.

## CI / deploy
- **`.github/workflows/ci.yml`** runs on PRs and pushes to `main`: three
  independent status-check jobs — `lint`, `test` (installs Chromium first for
  the Storybook browser tests), and `build`.
- **`.github/workflows/deploy.yml`** runs on push to `main`: `pnpm build`, then
  assembles a single `_site/` artifact — the app at the Pages root,
  `storybook-static/` under `/storybook/`, and the prompt-builder under
  `/prompt-builder/` — and publishes to GitHub Pages. Each app's Vite `base` is
  set accordingly (`/coderpad-prysm/`, and `…/prompt-builder/` in build mode).
- pnpm 10 blocks dependency build scripts by default; `pnpm-workspace.yaml`
  allowlists `esbuild` and `@tailwindcss/oxide` under `onlyBuiltDependencies`.
