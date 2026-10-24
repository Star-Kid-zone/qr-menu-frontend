export type { PlatformMarketingAsset } from "@/services/superadmin.service";

export type StudioTab = "vault" | "decoder" | "aistudio" | "automation";

export interface ScriptDownloadItem {
  name: string;
  sizeBytes: number;
  mtime: number;
  kind: "image" | "video";
}

export interface IndustryItem {
  id: string;
  name?: string;
  title?: string;
}
