import type { ReactNode, Ref } from "react";
import {
  TextField,
  Label,
  Input,
  Text,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";
import type { LucideIcon } from "lucide-react";

// Shared field chrome, reused by TextInput / TextArea / Select so freeform inputs
// match the structured controls (Stepper/Segmented): 1.5px border, 48px touch
// height, focus ring, danger border when invalid.
export const FIELD = "flex flex-col gap-1.5";
export const LABEL = "text-sm font-semibold text-neutral-700";
export const DESC = "text-xs text-neutral-500";
export const ERROR = "text-xs font-medium text-danger-600";

const CONTROL_BASE =
  "block w-full min-h-12 rounded-lg border-[1.5px] text-base outline-none transition-colors data-[invalid]:border-danger-500 disabled:cursor-not-allowed disabled:opacity-50";

// `light` (default surfaces) and `dark` (command bars). Same focus-ring pattern,
// tone-appropriate colors.
const CONTROL_TONE = {
  light:
    "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 data-[focused]:border-accent-600 data-[focused]:ring-[3px] data-[focused]:ring-accent-600/35",
  dark: "border-neutral-700 bg-neutral-800 text-neutral-100 placeholder:text-neutral-400 data-[focused]:border-neutral-400 data-[focused]:bg-neutral-900 data-[focused]:ring-[3px] data-[focused]:ring-neutral-500/50",
} as const;

const ICON_TONE = {
  light: "text-neutral-400 group-focus-within:text-neutral-600",
  dark: "text-neutral-400 group-focus-within:text-neutral-200",
} as const;

export type TextInputProps = Omit<AriaTextFieldProps, "className" | "children"> & {
  label?: ReactNode;
  /** Helper text below the field. */
  description?: ReactNode;
  /** Shown (in danger tone) when the field is invalid. */
  errorMessage?: ReactNode;
  placeholder?: string;
  /** Text-like input type. Numeric input belongs in `Stepper`. */
  type?: "text" | "email" | "tel" | "url" | "search" | "password";
  /** Leading icon rendered inside the field. */
  icon?: LucideIcon;
  /** Trailing adornment slot — e.g. a clear button or a shortcut hint. */
  trailing?: ReactNode;
  /** Surface tone: `light` (default) or `dark` for command bars. */
  tone?: "light" | "dark";
  /** Forwarded to the underlying `<input>` — for imperative focus. */
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
};

// A single-line text field. react-aria `TextField` wires the label, description,
// and validation error to the input for free; `icon` / `trailing` add adornments
// and `tone="dark"` adapts it to a dark command bar.
export default function TextInput({
  label,
  description,
  errorMessage,
  placeholder,
  type = "text",
  icon: Icon,
  trailing,
  tone = "light",
  inputRef,
  className = "",
  ...props
}: TextInputProps) {
  const control = [
    CONTROL_BASE,
    CONTROL_TONE[tone],
    Icon ? "pl-10" : "pl-3",
    trailing != null ? "pr-9" : "pr-3",
  ].join(" ");

  return (
    <TextField {...props} className={`${FIELD} ${className}`.trim()}>
      {label != null && <Label className={LABEL}>{label}</Label>}
      <div className="group relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${ICON_TONE[tone]}`}
          />
        )}
        <Input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={control}
        />
        {trailing != null && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {description != null && (
        <Text slot="description" className={DESC}>
          {description}
        </Text>
      )}
      <FieldError className={ERROR}>{errorMessage}</FieldError>
    </TextField>
  );
}
