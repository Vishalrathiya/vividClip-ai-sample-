/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppConfig, UsageQuota, VideoJob } from '../types';

function getSessionId(): string {
  let sessionId = localStorage.getItem('vividclip_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('vividclip_session_id', sessionId);
  }
  return sessionId;
}

const headers = () => ({
  'Content-Type': 'application/json',
  'x-session-id': getSessionId(),
});

export const api = {
  getSessionId,

  async getConfig(): Promise<AppConfig> {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('Failed to load configuration');
    return res.json();
  },

  async getUsage(): Promise<UsageQuota> {
    const res = await fetch('/api/usage', {
      headers: headers(),
    });
    if (!res.ok) throw new Error('Failed to fetch usage limits');
    return res.json();
  },

  async checkSafety(prompt: string): Promise<{ safe: boolean; reason?: string }> {
    const res = await fetch('/api/safety/check', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return { safe: true };
    return res.json();
  },

  async generateVideo(payload: {
    prompt: string;
    aspectRatio: '16:9' | '9:16' | '1:1';
    duration: 5 | 7;
    style: string;
    resolution: '720p' | '1080p';
    referenceImage?: string;
    mode: 'veo' | 'demo';
  }): Promise<{ jobId: string; status: string; estimatedWaitSeconds: number; remainingDailyGenerations: number }> {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        ...payload,
        sessionId: getSessionId(),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to start video generation');
    }
    return data;
  },

  async getJob(id: string): Promise<VideoJob> {
    const res = await fetch(`/api/jobs/${id}`, {
      headers: headers(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Job not found');
    }
    return res.json();
  },

  async getJobs(): Promise<VideoJob[]> {
    const res = await fetch('/api/jobs', {
      headers: headers(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.jobs || [];
  },

  async cancelJob(id: string): Promise<void> {
    await fetch(`/api/jobs/${id}/cancel`, {
      method: 'POST',
      headers: headers(),
    });
  },

  async deleteJob(id: string): Promise<void> {
    await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
  },
};
