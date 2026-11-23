import type { StaffRole } from '@/constants';
import type { StaffMember } from '@/types';

export interface StaffFormState {
  id: string | null;
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  active: boolean;
}

export type StaffView = 'cards' | 'table';
export type StatusFilter = 'all' | 'active' | 'inactive';
export type StaffSort = 'name' | 'newest' | 'oldest' | 'role';

/** Row-level actions shared by the card, the table row and the row menu. */
export interface StaffActions {
  onEdit: (member: StaffMember) => void;
  onDelete: (member: StaffMember) => void;
  onToggleActive: (member: StaffMember) => void;
  onResetPassword: (member: StaffMember) => void;
  onCopyEmail: (member: StaffMember) => void;
}

export interface StaffItemProps extends StaffActions {
  member: StaffMember;
  selected: boolean;
  busy: boolean;
  onSelect: (member: StaffMember, selected: boolean) => void;
}

export interface StaffModalProps {
  isOpen: boolean;
  form: StaffFormState;
  setForm: React.Dispatch<React.SetStateAction<StaffFormState>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: () => void;
  /** Opened from "Reset password": explains the effect of setting a new password. */
  passwordFocus?: boolean;
}
