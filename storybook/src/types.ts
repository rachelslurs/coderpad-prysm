// Shared types for the design system. Everything here is generic — no domain
// (patient) knowledge lives in this package.

// Semantic color tones, backed by the tokens in styles/theme.css. Components
// accept a Tone and map it to utility classes, so consumers style by meaning
// (danger / success / …) instead of raw palette names.
export type Tone =
  | "neutral"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "danger";
