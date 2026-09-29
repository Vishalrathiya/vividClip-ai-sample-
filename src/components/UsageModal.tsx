/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, Clock, ShieldCheck, Zap } from 'lucide-react';
import { UsageQuota } from '../types';

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  usage: UsageQuota | null;
}

export const UsageModal: React.FC<UsageModalProps> = ({ isOpen, onClose, usage }) => {
  if (!isOpen) return null;

  const hoursLeft = usage ? Math.floor(usage.resetInSeconds / 3600) : 0;
  const minutesLeft = usage ? Math.floor((usage.resetInSeconds % 3600) / 60) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Free Tier Allowance</h3>
            <p className="text-xs text-neutral-400">Daily generation quota & reset schedule</p>
          </div>
        </div>

        {/* Big numbers */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Remaining Generations Today
            </span>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              3 Daily Limit
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-extrabold font-mono text-amber-400 tabular-nums">
              {usage ? usage.remaining : 3}
            </span>
            <span className="text-neutral-400 text-sm">of 3 credits available</span>
          </div>

          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${((usage ? usage.remaining : 3) / 3) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Resets in:</span>
            </span>
            <span className="font-mono text-neutral-200 font-medium">
              {hoursLeft}h {minutesLeft}m (00:00 UTC)
            </span>
          </div>
        </div>

        {/* Free Tier Policies list */}
        <div className="space-y-2.5 text-xs text-neutral-300 mb-6">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">100% Free: </span>
              No credit card, account login, or hidden trial fees required.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Resolution & Length: </span>
              720p HD output, 5s to 7s clip duration optimized for social media.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Watermark & Retention: </span>
              Subtle corner badge; videos are hosted for 48 hours for preview and instant download.
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
