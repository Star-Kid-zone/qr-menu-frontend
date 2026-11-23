import type { ReactNode } from "react";

export interface AdminFormPageProps {
  title: string;
  description?: string;
  onBack: () => void;
  backLabel?: string;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
  /** Optional extra element rendered to the left of the Cancel/Submit buttons */
  headerExtra?: ReactNode;
  children: ReactNode;
}
