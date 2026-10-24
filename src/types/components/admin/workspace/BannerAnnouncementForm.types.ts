import * as z from "zod";
import { bannerAnnouncementSchema } from "@/features/workspace";

export interface BannerAnnouncementFormProps {
    formId: string;
    isOpen: boolean;
    readOnly: boolean;
    compact?: boolean;
    initialValues: BannerAnnouncementValues;
    onSubmit: (values: BannerAnnouncementValues) => void;
    error?: string | null;
    loading?: boolean;
    /** Fires with the live (unsaved) form values on every field change — used to drive a live preview. */
    onValuesChange?: (values: BannerAnnouncementValues) => void;
}

export type BannerAnnouncementValues = z.infer<typeof bannerAnnouncementSchema>;
