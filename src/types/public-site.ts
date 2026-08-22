import type { Menu } from '@/types';
import type { MappedPublicUserDetails } from '@/types/components/templates/mapPublicUserDetails.types';

export type PublicMenuPayload = {
  mapped: MappedPublicUserDetails;
  menuItems: Menu[];
  routeSlug: string;
};
