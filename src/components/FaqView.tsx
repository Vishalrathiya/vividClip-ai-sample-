/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, Clock, Zap, Shield, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UsageQuota } from '../types';

interface FaqViewProps {
  usage: UsageQuota | null;
  onOpenPrivacy: () => void;
  onOpenSetup: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ usage, onOpenPrivacy, onOpenSetup }) => {
  const faqs = [
    {
      q: 'How many videos can I create for free?',
      a: 'Every user receives 3 free high-definition video generations per day. Your free allowance automatically replenishes every day at 00:00 UTC (midnight UTC). No credit card or account sign-up is required.',
    },
    {
      q: 'Why is there a limit of 3 free clips per day?',
      a: 'High-fidelity AI video synthesis using models like Google Veo requires substantial GPU compute. Enforcing fair daily limits on the server ensures reliable access, short queue wait times, and zero surprise costs for all users.',
    },
    {
      q: 'How long are the generated videos and what resolutions are supported?',
      a: 'Our standard free tier offers 5-second and 7-second high-definition clips at 720p HD resolution. This balance maximizes rendering speed (typically 45-60 seconds in queue) while producing crisp motion suitable for social media, Shorts, Reels, and creative prototyping.',
    },
    {
      q: 'Is there a watermark on free videos?',
      a: 'Yes, videos generated on the free tier include a discreet, minimalist "VividClip Free Tier" badge in the lower-right corner. It is positioned subtly so your focal content remains clear.',
    },
    {
      q: 'How long are my generated clips saved?',
      a: 'Clips are retained on our temporary preview cloud for 48 hours from the moment of generation. You can download the full MP4 file to your phone, tablet, or desktop computer at any time to keep it permanently.',
    },
    {
      q: 'Can I upload an image to turn into a video?',
      a: 'Yes! In the Create tab, you can attach any PNG, JPG, or WebP image up to 5MB. The AI video model will use your image as the starting frame and animate natural camera motion and dynamic elements around it.',
    },
    {
      q: 'Can I connect my own Google Gemini / Veo API Key?',
      a: 'Yes. The backend seamlessly reads the GEMINI_API_KEY environment variable. When present, it connects directly to the Google Veo 3.1 Lite API (veo-3.1-lite-generate-preview). When no key is set or in demo mode, our fast procedural synthesis engine provides an instant simulated workflow.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-display">
          Limits, Queue & Free Tier FAQ
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
          Everything you need to know about our free AI video generator, queue behavior, retention policies, and privacy standards.
        </p>
      </div>

      {/* Free Tier Status Box */}
      <div className="mb-10 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Your Daily Free Quota</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Reset schedule: Midnight 00:00 UTC
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {usage ? usage.remaining : 3}
              </span>
              <span className="text-neutral-400 text-xs"> / 3 remaining today</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            <span className="text-neutral-400 block mb-0.5">Average Queue</span>
            <span className="font-semibold text-neutral-200">~45 to 60 seconds</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            <span className="text-neutral-400 block mb-0.5">Cloud Retention</span>
            <span className="font-semibold text-neutral-200">48 Hours Temporary</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            <span className="text-neutral-400 block mb-0.5">Watermark</span>
            <span className="font-semibold text-neutral-200">Discreet Corner Badge</span>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4 mb-10">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-left"
          >
            <h3 className="text-sm sm:text-base font-semibold text-neutral-100 mb-2 flex items-start gap-2">
              <span className="text-amber-400 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Action Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-base font-bold text-white mb-1">Developer & Privacy Details</h4>
          <p className="text-xs text-neutral-400">
            Inspect our zero-training privacy policy or review API deployment setup.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPrivacy}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenSetup}
            className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-semibold text-neutral-950 transition-colors"
          >
            Setup Guide
          </button>
        </div>
      </div>
    </div>
  );
};
