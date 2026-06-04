import type { ReactNode } from "react";
import {
  TextField,
  Label,
  Input,
  Text,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

// Shared field chrome, reused by TextInput / TextArea / Select so freeform inputs
// match the structured controls (Stepper/Segmented): 1.5px slate border, 48px
// touch height, teal focus ring, danger border when invalid.
export const FIELD = "flex flex-col gap-1.5";
export const LABEL = "text-sm font-semibold text-neutral-700";
export const CONTROL =
  "block w-full min-h-12 rounded-lg border-[1.5px] border-neutral-300 bg-white px-3 text-base text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 data-[focused]:border-accent-600 data-[focused]:ring-[3px] data-[focused]:ring-accent-600/35 data-[invalid]:border-danger-500 disabled:cursor-not-allowed disabled:opacity-50";
export const DESC = "text-xs text-neutral-500";
export const ERROR = "text-xs font-medium text-danger-600";

export type TextInputProps = Omit<AriaTextFieldProps, "className" | "children"> & {
  label?: ReactNode;
  /** Helper text below the field. */
  description?: ReactNode;
  /** Shown (in danger tone) when the field is invalid. */
  errorMessage?: ReactNode;
  placeholder?: string;
  /** Text-like input type. Numeric input belongs in `Stepper`. */
  type?: "text" | "email" | "tel" | "url" | "search" | "password";
  className?: string;
};

// A single-line text field. react-aria `TextField` wires the label, description,
// and validation error to the input for free.
export default function TextInput({
  label,
  description,
  errorMessage,
  placeholder,
  type = "text",
  className = "",
  ...props
}: TextInputProps) {
  return (
    <TextField {...props} className={`${FIELD} ${className}`.trim()}>
      {label != null && <Label className={LABEL}>{label}</Label>}
      <Input type={type} placeholder={placeholder} className={CONTROL} />
      {description != null && (
        <Text slot="description" className={DESC}>
          {description}
        </Text>
      )}
      <FieldError className={ERROR}>{errorMessage}</FieldError>
    </TextField>
  );
}
