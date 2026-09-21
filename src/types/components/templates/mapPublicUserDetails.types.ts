import type { SocialLink } from "@/types";
import type { GalleryItem, OfferRow, PublicBusinessBranch } from '@/components/templates/core/types';

export type MappedPublicUserDetails = {
      userId: number;
      /** Workspace id (`settings.id`). */
      workspaceId: number | null;
      /** Workspace `settings` object (snake_case, same as dashboard). */
      settings: Record<string, unknown>;
      themeColour: string | null;
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      publicSlug: string | null;
      landingThemeRaw: string;
      menuThemeRaw: string;
      menubtnStatus: boolean;
      paybtnStatus: boolean;
      reviewbtnStatus: boolean;
      specialOfferStatus: boolean;
      announcementEnabled: boolean;
      announcementText: string;
      currency: { id?: number; symbol: string; code?: string; name?: string } | null;
      /** Primary business (backend `business` — first active branch). */
      business: Record<string, unknown>;
      /** Branch list — derived from the single `business` object returned by the API. */
      branches: PublicBusinessBranch[];
      social: SocialLink[];
      paymentLink: string;
      reviewLink: string;
      /** Active offers (backend filters dates). */
      offers: OfferRow[];
      offersSectionEnabled: boolean;
      /** Active gallery items only (backend `gallery`). */
      gallery: GalleryItem[];
      /** Full gallery including inactive — for admin parity / future use. */
      workspaceGallery: GalleryItem[];
      /** Raw workspace offers before date filter — optional analytics. */
      workspaceOffersCount: number;
      /** Parsed from `business.about_features` (industry feature blocks). */
      aboutHighlights: string[];
    };
