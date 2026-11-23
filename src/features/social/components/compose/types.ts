import React from "react";
import type { SocialPlatform } from "@/types";

export interface ComposePlatformInfo {
  id: SocialPlatform;
  name: string;
  subname: string;
  capabilities: string;
  icon: React.ReactNode;
  brandColor: string;
  gradient: string;
  glowShadow: string;
}
