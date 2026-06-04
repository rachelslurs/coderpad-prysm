// Scale tokens for the layout primitives.
//
// The layout primitives never take a raw CSS length. They take a *scale token*
// — one of the design system's existing Tailwind steps (the same ones the rest
// of the system uses: Card → p-4, …) — and resolve it through a whole-literal
// class map. Same rule as Badge's `Record<Tone, string>`: Tailwind only
// generates classes it can see statically, so every value here is a complete
// literal, never built by interpolation. The payoff: no magic numbers at the
// call site, and spacing stays consistent with the rest of the system.

/** Spacing scale — Tailwind's spacing steps (rem). Used for gaps and padding. */
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export const GAP: Record<Space, string> = {
  0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4",
  5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12",
};

export const PAD: Record<Space, string> = {
  0: "p-0", 1: "p-1", 2: "p-2", 3: "p-3", 4: "p-4",
  5: "p-5", 6: "p-6", 8: "p-8", 10: "p-10", 12: "p-12",
};

export const PAD_X: Record<Space, string> = {
  0: "px-0", 1: "px-1", 2: "px-2", 3: "px-3", 4: "px-4",
  5: "px-5", 6: "px-6", 8: "px-8", 10: "px-10", 12: "px-12",
};

export const MARGIN_E: Record<Space, string> = {
  0: "me-0", 1: "me-1", 2: "me-2", 3: "me-3", 4: "me-4",
  5: "me-5", 6: "me-6", 8: "me-8", 10: "me-10", 12: "me-12",
};

/** Border width — Tailwind's border scale. `1` is the default 1px hairline. */
export type BorderWidth = 0 | 1 | 2 | 4 | 8;

export const BORDER: Record<BorderWidth, string> = {
  0: "border-0", 1: "border", 2: "border-2", 4: "border-4", 8: "border-8",
};

/** Typographic measure — Tailwind's max-width tokens. `prose` (~65ch) is the
 *  readable default for long-form text. */
export type Measure = "prose" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export const MAX_W: Record<Measure, string> = {
  prose: "max-w-prose", xs: "max-w-xs", sm: "max-w-sm", md: "max-w-md",
  lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl", full: "max-w-full",
};

/** Minimum block-size — Tailwind's min-height tokens. */
export type MinHeight = "screen" | "dvh" | "svh" | "full" | "none";

export const MIN_H: Record<MinHeight, string> = {
  screen: "min-h-screen", dvh: "min-h-dvh", svh: "min-h-svh",
  full: "min-h-full", none: "min-h-0",
};
