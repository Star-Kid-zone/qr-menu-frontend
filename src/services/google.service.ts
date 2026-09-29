import api from './api.service';
import type { GoogleReviewRecord } from './workspace.service';

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

export const googleService = {
  /**
   * Fetch the Google OAuth authorization URL to initiate sign-in.
   */
  async getOAuthUrl(): Promise<{ url: string }> {
    const res = await api.get<{ url: string }>('/google/oauth/start');
    return res.data;
  },

  /**
   * Get Google Business Profile connection & auto-reply status.
   */
  async getStatus(): Promise<GoogleBusinessStatus> {
    const res = await api.get<GoogleBusinessStatus>('/google/status');
    return res.data;
  },

  /**
   * Disconnect Google Business Profile.
   */
  async disconnect(): Promise<{ message: string; isConnected: boolean }> {
    const res = await api.post<{ message: string; isConnected: boolean }>('/google/disconnect');
    return res.data;
  },

  /**
   * Save auto-reply rules and AI configuration.
   */
  async updateAutoReplySettings(settings: AutoReplySettingsInput): Promise<{ message: string; status: GoogleBusinessStatus }> {
    const res = await api.put<{ message: string; status: GoogleBusinessStatus }>('/google/auto-reply-settings', settings);
    return res.data;
  },

  /**
   * Generate an empathetic, context-aware AI reply for a specific review using Gemini.
   */
  async generateAiReply(reviewId: string | number, options?: { tone?: string; customPrompt?: string }): Promise<{ reply: string }> {
    const res = await api.post<{ reply: string }>(`/google/reviews/${reviewId}/generate-ai-reply`, options || {});
    return res.data;
  },

  /**
   * Submit reply to Google (and save locally).
   */
  async replyToReview(reviewId: string | number, replyText: string): Promise<{ message: string; review: GoogleReviewRecord }> {
    const res = await api.post<{ message: string; review: GoogleReviewRecord }>(`/google/reviews/${reviewId}/reply`, { replyText });
    return res.data;
  },

  /**
   * Trigger immediate auto-reply batch on unreplied reviews.
   */
  async runAutoReply(): Promise<{ message: string; totalFound: number; repliedCount: number; errors: string[] }> {
    const res = await api.post<{ message: string; totalFound: number; repliedCount: number; errors: string[] }>('/google/reviews/run-auto-reply');
    return res.data;
  },
};
