# CLAUDE.md

## Project layout
pnpm workspace monorepo (`pnpm@10.27.0`). Workspaces: `app` (`@prysm/app`) and `storybook` (`@prysm/design-system`). The design system is consumed by the app via `workspace:*`.

## Storybook MCP (component docs & story tools)
The `@storybook/addon-mcp` addon is configured in [storybook/.storybook/main.ts](storybook/.storybook/main.ts) and registered as a project MCP server in [.mcp.json](.mcp.json) at `http://localhost:6006/mcp`.

**The MCP tools only work while the Storybook dev server is running.** Start it from the repo root with `pnpm storybook` (serves on port 6006).

When working on `@prysm/design-system` components or stories, prefer the Storybook MCP tools over guessing:
- `list-all-documentation` — discover available component/docs IDs (pass `withStoryIds: true` when you need story IDs).
- `get-documentation` / `get-documentation-for-story` — retrieve props, usage, variants. **Never invent props or variants** — look them up; if undocumented, say so.
- `get-storybook-story-instructions` — call before creating/editing components or stories (framework-specific import & story patterns).
- `preview-stories` — call after changing a component/story; include the returned preview URLs in your response.
- `run-story-tests` — run the Vitest-backed story tests after changes; fix failures before reporting done.
