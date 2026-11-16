import type { StudioPartFocus } from "@/features/workspace/studio/resolvePart";
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
  /** Optional callback to enter edit mode when user clicks an edit action inside the form */
  onStartEditing?: (subSection?: string) => void;
  /** Optional initially active/expanded subsection when entering edit mode */
  initialActiveSubSection?: string | null;
  /** A part of the page the owner tapped in the live preview. */
  focusedPart?: StudioPartFocus | null;
  /** Menu category names in item order, for the menu Categories panel. */
  menuCategories?: readonly string[];
  /** Reload settings after something saved outside the form (e.g. a new hero photo). */
  onAssetsChanged?: () => void | Promise<void>;
}
