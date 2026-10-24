import React from "react";
import type { SocialPlatform } from "@/services/social.service";

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
