import { User } from "lucide-react";
import { toInitials } from "../lib/toInitials";

const SIZE = {
  sm: "h-9 w-9 text-sm", // 36px
  md: "h-12 w-12 text-base", // 48px
  lg: "h-14 w-14 text-xl", // 56px
} as const;

const ICON = { sm: "h-5 w-5", md: "h-6 w-6", lg: "h-[26px] w-[26px]" } as const;

export type AvatarProps = {
  /** Photo URL. Falls back to initials, then a generic icon. */
  src?: string;
  /** Name — rendered as initials when there's no photo. */
  name?: string;
  /** Diameter. `sm` 36px · `md` 48px (default) · `lg` 56px. */
  size?: keyof typeof SIZE;
  /** Alt text for the photo (defaults to `name`). */
  alt?: string;
};

const BASE =
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold";

// Photo-or-fallback avatar: photo → initials (accent tint) → generic user icon.
export default function Avatar({ src, name, size = "md", alt }: AvatarProps) {
  if (src) {
    return (
      <span className={`${BASE} ${SIZE[size]} bg-neutral-200`}>
        <img
          src={src}
          alt={alt ?? name ?? ""}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  if (name) {
    return (
      <span
        className={`${BASE} ${SIZE[size]} border border-accent-100 bg-accent-50 text-accent-700`}
        aria-label={name}
        role="img"
      >
        {toInitials(name)}
      </span>
    );
  }

  return (
    <span
      className={`${BASE} ${SIZE[size]} border border-neutral-200 bg-neutral-100 text-neutral-400`}
      role="img"
      aria-label="No photo"
    >
      <User className={ICON[size]} aria-hidden="true" />
    </span>
  );
}
