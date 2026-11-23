export interface GoogleBusinessStatus {
  isConnected: boolean;
  accountName: string | null;
  accountId: string | null;
  locationId: string | null;
  connectedAt: string | null;
  autoReplyEnabled: boolean;
  autoReplyMinRating: number;
  autoReplyAiTone: string;
  autoReplyCustomPrompt: string | null;
  autoReplyTemplate: string | null;
}

export interface AutoReplySettingsInput {
  enabled?: boolean;
  minRating?: number;
  aiTone?: string;
  customPrompt?: string | null;
  template?: string | null;
}
