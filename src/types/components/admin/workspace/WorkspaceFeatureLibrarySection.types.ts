import { Setting } from "@/types";

export interface WorkspaceFeatureLibrarySectionProps {
    workspace: Pick<Setting, 'id' | 'industry_feature_catalog'>;
    onSaved: () => Promise<void> | void;
}

export type FeatureItem = { id: number; name: string };
export type FeatureCatalog = NonNullable<Setting['industry_feature_catalog']>;
