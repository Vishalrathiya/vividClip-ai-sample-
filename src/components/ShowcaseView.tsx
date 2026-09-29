/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Sparkles, Film, ArrowRight, Ratio, Clock } from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../constants';
import { AspectRatio } from '../types';

interface ShowcaseViewProps {
  onUsePrompt: (prompt: string, style: string, aspectRatio: AspectRatio) => void;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ onUsePrompt }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-display">
          Community & Sample Showcase
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
          Explore short video clips created across multiple visual styles and aspect ratios. Click "Use Prompt" on any clip to customize and generate your own version.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXAMPLE_PROMPTS.map((item, idx) => (
          <div
            key={idx}
            className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            {/* Video container */}
            <div className="relative aspect-video w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
              <video
                src={`/api/video/${item.videoId}`}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-neutral-300">
                  {item.aspectRatio}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-neutral-300">
                  {item.duration}s
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-400/90 text-[10px] font-semibold text-neutral-950">
                  {item.style}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed italic mb-4">
                  "{item.prompt}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500 font-mono">
                  Veo 3.1 Lite Compatible
                </span>
                <button
                  type="button"
                  onClick={() => onUsePrompt(item.prompt, item.style, item.aspectRatio)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Use This Prompt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
