import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type EmptyStateProps = {
  /** Optional icon shown above the message. */
  icon?: LucideIcon;
  /** The message (e.g. "No patients match your search."). */
  children: ReactNode;
  className?: string;
};

// Centered "nothing here" message. role="status" so assistive tech announces it
// when results disappear (e.g. a filter clears the list).
export default function EmptyState({
  icon: Icon,
  children,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center gap-2 px-4 py-12 text-center text-base text-neutral-500 ${className}`.trim()}
    >
      {Icon && <Icon aria-hidden="true" className="h-6 w-6 text-neutral-400" />}
      <span>{children}</span>
    </div>
  );
}
