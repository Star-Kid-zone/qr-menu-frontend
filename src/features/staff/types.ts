import type { StaffRole } from '@/constants/permissions';
import type { StaffMember } from '@/services/staff.service';

export interface StaffFormState {
  id: string | null;
  name: string;
  phone: string;
  password: string;
  role: StaffRole;
  active: boolean;
}

export interface StaffCardProps {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
  onDelete: (member: StaffMember) => void;
}

export interface StaffModalProps {
  isOpen: boolean;
  form: StaffFormState;
  setForm: React.Dispatch<React.SetStateAction<StaffFormState>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
