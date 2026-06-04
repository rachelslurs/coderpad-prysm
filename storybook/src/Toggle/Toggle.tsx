import type { ReactNode } from "react";
import { Switch } from "react-aria-components";

export type ToggleProps = {
  /** Visible label (also the accessible name). Omit it and pass `aria-label`
   *  for a label-less switch. */
  children?: ReactNode;
  /** On/off state (controlled). */
  isSelected?: boolean;
  /** Initial on/off state (uncontrolled). */
  defaultSelected?: boolean;
  /** Fires with the new on/off state. */
  onChange?: (isSelected: boolean) => void;
  /** Disable interaction (dims to 50% + not-allowed cursor). */
  isDisabled?: boolean;
  /** Accessible name when there is no visible `children` label. */
  "aria-label"?: string;
};

// Binary on/off switch. react-aria-components Switch gives role="switch", Space
// to toggle, and announced state; the pill visual is ours, driven by render props.
export default function Toggle({ children, ...props }: ToggleProps) {
  return (
    <Switch
      {...props}
      className="group flex w-full cursor-pointer items-center justify-between gap-4 text-base font-semibold text-neutral-900 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    >
      {({ isSelected, isFocusVisible }) => (
        <>
          {children != null && <span>{children}</span>}
          <span
            className={`flex h-8 w-14 shrink-0 items-center rounded-full p-[3px] transition-colors ${
              isSelected ? "bg-accent-600" : "bg-neutral-400"
            } ${isFocusVisible ? "ring-[3px] ring-accent-600/35" : ""}`}
          >
            <span
              className={`h-[26px] w-[26px] rounded-full bg-white shadow-sm transition-transform ${
                isSelected ? "translate-x-6" : ""
              }`}
            />
          </span>
        </>
      )}
    </Switch>
  );
}
