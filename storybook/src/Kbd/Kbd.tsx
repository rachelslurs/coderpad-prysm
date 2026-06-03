import type { HTMLAttributes, ReactNode } from "react";

export type KbdProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

// A keyboard keycap (semantic <kbd>) for shortcut hints — "/", "ESC", etc.
export default function Kbd({ className = "", children, ...rest }: KbdProps) {
  return (
    <kbd
      className={`select-none rounded border border-neutral-200 bg-neutral-100/80 px-2 py-0.5 text-xs font-bold tracking-widest text-neutral-400 ${className}`.trim()}
      {...rest}
    >
      {children}
    </kbd>
  );
}
