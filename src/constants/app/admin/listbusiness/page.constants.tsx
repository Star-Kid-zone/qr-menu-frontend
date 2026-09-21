import { WorkspaceTabId } from "@/types/app/admin/listbusiness/page.types";
import type { ReactNode } from "react";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { PiBookOpenTextBold, PiGoogleLogoBold, PiQuestionBold, PiStarBold, PiStorefrontBold, PiSwatchesBold } from "react-icons/pi";
import { RiGlobalLine, RiLinksLine } from "react-icons/ri";
import type { PermissionUnit } from "@/constants/permissions";

export const INLINE_WORKSPACE_FORM_ID = 'inline-workspace-settings';
export const INLINE_BANNER_FORM_ID = 'inline-banner-settings';
export const INLINE_ADD_BUSINESS_FORM_ID = 'inline-add-business';
export const TABS: Array<{
      id: WorkspaceTabId;
      label: string;
      description: string;
      icon: ReactNode;
      unit: PermissionUnit;
    }> = [
      { id: 'workspace', label: 'Website', description: 'Brand and controls', icon: <PiSwatchesBold className="size-5" />, unit: 'workspace' },
      { id: 'businesses', label: 'Businesses', description: 'Branches and links', icon: <PiStorefrontBold className="size-5" />, unit: 'workspace' },
      {
        id: 'public-site',
        label: 'Public site',
        description: 'Tenant URL and API',
        icon: <RiLinksLine className="size-5" />,
        unit: 'workspace',
      },
      { id: 'banners', label: 'Banners', description: 'Landing announcement', icon: <HiOutlineSpeakerphone className="size-5" />, unit: 'workspace' },
      { id: 'offers', label: 'Offers', description: 'Promotions', icon: <PiStarBold className="size-5" />, unit: 'workspace' },
      { id: 'gallery', label: 'Gallery', description: 'Landing visuals', icon: <RiGlobalLine className="size-5" />, unit: 'workspace' },
      { id: 'content', label: 'Story & Stats', description: 'Our Story + stats bar', icon: <PiBookOpenTextBold className="size-5" />, unit: 'workspace' },
      { id: 'faqs', label: 'FAQs', description: 'Common questions', icon: <PiQuestionBold className="size-5" />, unit: 'workspace' },
      { id: 'reviews', label: 'Google Reviews', description: 'Pick which reviews appear on your site', icon: <PiGoogleLogoBold className="size-5" />, unit: 'reviews' },
    ];
export const DEFAULT_TAB: WorkspaceTabId = 'workspace';
