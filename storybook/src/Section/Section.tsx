import type { ReactNode } from "react";

export type SectionProps = {
  /** Optional group heading (small uppercase label). Omit for an untitled group. */
  title?: ReactNode;
  className?: string;
  children: ReactNode;
};

// A labelled group of content — heading + body. The "tier" pattern, generalized.
export default function Section({ title, className = "", children }: SectionProps) {
  return (
    <section className={className}>
      {title != null && (
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-500">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
