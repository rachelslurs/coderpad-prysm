import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type OverlayPanelProps = {
  /** Called on Escape (the caller also renders its own close control). */
  onClose: () => void;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "onClose"> & {
    // Allow data-* passthrough (test ids, analytics hooks).
    [dataAttr: `data-${string}`]: string | undefined;
  };

// An absolutely-positioned overlay that fills its nearest positioned ancestor,
// with the WCAG dialog plumbing: focus moves to its first focusable element on
// open, and Escape calls onClose. Restoring focus to the trigger on close is the
// caller's concern (it owns the trigger). Visual surface (background, etc.) is
// supplied via className so the panel stays context-agnostic.
export default function OverlayPanel({
  onClose,
  className = "",
  children,
  ...rest
}: OverlayPanelProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const first = node.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? node).focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <aside
      ref={ref}
      tabIndex={-1}
      className={`absolute inset-0 z-20 flex flex-col shadow-2xl ${className}`.trim()}
      {...rest}
    >
      {children}
    </aside>
  );
}
