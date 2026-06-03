// Generic helper: "Margaret Holloway" → "MH". Domain-agnostic (any name/label),
// so it stays in the design system for reuse (avatars, privacy masks, etc.).
export const toInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .join("");
