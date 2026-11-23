import type { StaffRole } from '@/constants/permissions';

export interface StaffMember {
  id: string;
  name: string;
  /** Sign-in identifier. */
  email: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
}
