export type { PlatformMarketingAsset } from "@/types";

export type StudioTab = "vault" | "decoder" | "aistudio" | "automation";

export interface ScriptDownloadItem {
  name: string;
  sizeBytes: number;
  mtime: number;
  kind: "image" | "video";
}

/** One generated caption from the copywriter; the endpoint may also tag its language. */
export interface CopyVariant {
  caption?: string;
  hashtags?: string[];
  language?: string;
}

export interface IndustryItem {
  id: string;
  name?: string;
  title?: string;
}
