import type { Currency } from "@/types";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";

export interface WorkspaceSettingsFormProps {
  formId: string;
  isOpen: boolean;
  initialValues: WorkspaceSettingsFormValues;
  onSubmit: (values: WorkspaceSettingsFormValues) => void;
  error?: string | null;
  loading?: boolean;
  currencies?: Currency[];
  showPalettePresets?: boolean;
  /** When true, fields are non-interactive (view mode). */
  readOnly?: boolean;
  /** Tighter spacing for single-screen admin layouts. */
  compact?: boolean;
  /** Fires with the live (unsaved) form values on every field change — used to drive a live preview. */
  onValuesChange?: (values: WorkspaceSettingsFormValues) => void;
}
