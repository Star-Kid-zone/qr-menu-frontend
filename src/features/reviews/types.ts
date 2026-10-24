export interface AutoReplyToneOption {
  id: string;
  label: string;
  icon: string;
}

export const AUTO_REPLY_TONE_OPTIONS: AutoReplyToneOption[] = [
  { id: "warm_professional", label: "Warm & Professional", icon: "✨" },
  { id: "friendly", label: "Friendly & Casual", icon: "👋" },
  { id: "enthusiastic", label: "Enthusiastic & Grateful", icon: "🎉" },
  { id: "concise", label: "Concise & Direct", icon: "🎯" },
];
