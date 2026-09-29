/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoJob {
  id: string;
  sessionId: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  duration: 5 | 7;
  style: string;
  resolution: '720p' | '1080p';
  hasReferenceImage: boolean;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  step: string;
  progress: number;
  error?: string;
  createdAt: number;
  expiresAt: number;
  downloadUrl?: string;
  mode: 'veo' | 'demo';
}

export interface AppConfig {
  hasApiKey: boolean;
  supportedModels: Array<{
    id: string;
    name: string;
    resolution: string;
    free: boolean;
  }>;
  freeDailyLimit: number;
  retentionHours: number;
  watermarkPolicy: string;
  queueEstimate: string;
}

export interface UsageQuota {
  used: number;
  remaining: number;
  resetAt: string;
  resetInSeconds: number;
}

export type AspectRatio = '16:9' | '9:16' | '1:1';
export type Duration = 5 | 7;

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
  promptSuffix: string;
  accentColor: string;
}
