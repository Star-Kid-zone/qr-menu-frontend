import type { WorkspaceOfferItem } from "@/services/workspace.service";

export interface OfferFormData {
    title: string;
    description: string;
    discount: string;
    isActive: boolean;
}

export interface ListOffersProps {
    embedded?: boolean;
    initialOffers?: Offer[];
    initialCurrencySymbol?: string;
    onChanged?: () => void | Promise<void>;
}

export type Offer = WorkspaceOfferItem;
