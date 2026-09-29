/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Terminal, Key, Cpu, Server, Check } from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
}

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, hasApiKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Setup Guide & Architecture</h3>
            <p className="text-xs text-neutral-400">Environment variables, model integration & demo mode</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-neutral-300 mb-6">
          {/* Status badge */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400">Google Gemini / Veo API Key:</span>
            {hasApiKey ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>Configured (veo-3.1-lite ready)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono text-[11px]">
                <span>Demo / Simulation Mode Active</span>
              </span>
            )}
          </div>

          {/* Model provider abstraction */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <h4 className="text-white font-semibold flex items-center gap-1.5 mb-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Provider Abstraction Layer</span>
            </h4>
            <p className="text-neutral-400 leading-relaxed mb-2">
              The backend uses a clean service adapter layer (<code className="text-amber-300">server.ts</code>):
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>
                <strong className="text-neutral-200">Veo 3.1 Lite Provider:</strong> Calls <code className="text-amber-300">ai.models.generateVideos</code> with 720p resolution and polling via <code className="text-amber-300">ai.operations.getVideosOperation</code>.
              </li>
              <li>
                <strong className="text-neutral-200">FFmpeg Demo Synthesizer:</strong> When running without an API key or in testing mode, FFmpeg synthesizes genuine 720p MP4 files with motion gradients, style colors, and watermark.
              </li>
            </ul>
          </div>

          {/* Environment Variables */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 font-mono">
            <h4 className="text-white font-semibold flex items-center gap-1.5 mb-2 font-sans">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Required Environment Variables</span>
            </h4>
            <div className="space-y-1.5 text-[11px] text-neutral-400">
              <div>
                <span className="text-amber-300">GEMINI_API_KEY</span>: Required for real Veo video generation. Configured via Secrets in AI Studio.
              </div>
              <div>
                <span className="text-amber-300">APP_URL</span>: Host domain for CORS and callbacks.
              </div>
              <div>
                <span className="text-amber-300">PORT</span>: Server port (defaults to 3000).
              </div>
            </div>
          </div>

          {/* Running Commands */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px]">
            <h4 className="text-white font-semibold flex items-center gap-1.5 mb-2 font-sans">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Local Development & Build</span>
            </h4>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-neutral-300 space-y-1">
              <div><span className="text-neutral-500"># Start dev server</span></div>
              <div>npm run dev</div>
              <div className="pt-1"><span className="text-neutral-500"># Build for production</span></div>
              <div>npm run build</div>
              <div className="pt-1"><span className="text-neutral-500"># Start production server</span></div>
              <div>npm start</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
