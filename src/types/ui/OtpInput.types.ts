export interface OtpInputProps {
  /** The code typed so far (digits only). */
  value: string;
  onChange: (value: string) => void;
  /** Called once all digits are filled, e.g. to submit. */
  onComplete?: (value: string) => void;
  length?: number;
  /** Prefix for the box ids; the first box gets `id` itself so a <label htmlFor> can point at it. */
  id: string;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Accessible name of the group, e.g. "6-digit code". */
  label: string;
  'aria-describedby'?: string;
  /** Set by FormField when the field has an error. */
  'aria-invalid'?: boolean;
}
