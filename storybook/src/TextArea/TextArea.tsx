import type { ReactNode } from "react";
import {
  TextField,
  Label,
  TextArea as AriaTextArea,
  Text,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";
import { FIELD, LABEL, DESC, ERROR } from "../TextInput/TextInput";

const CONTROL =
  "block w-full resize-y rounded-lg border-[1.5px] border-neutral-300 bg-white px-3 py-2 text-base leading-relaxed text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 data-[focused]:border-accent-600 data-[focused]:ring-[3px] data-[focused]:ring-accent-600/35 data-[invalid]:border-danger-500 disabled:cursor-not-allowed disabled:opacity-50";

export type TextAreaProps = Omit<AriaTextFieldProps, "className" | "children"> & {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  placeholder?: string;
  /** Visible rows. Defaults to 3. */
  rows?: number;
  className?: string;
};

// A multi-line text field — same chrome as TextInput, vertically resizable.
export default function TextArea({
  label,
  description,
  errorMessage,
  placeholder,
  rows = 3,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <TextField {...props} className={`${FIELD} ${className}`.trim()}>
      {label != null && <Label className={LABEL}>{label}</Label>}
      <AriaTextArea rows={rows} placeholder={placeholder} className={CONTROL} />
      {description != null && (
        <Text slot="description" className={DESC}>
          {description}
        </Text>
      )}
      <FieldError className={ERROR}>{errorMessage}</FieldError>
    </TextField>
  );
}
