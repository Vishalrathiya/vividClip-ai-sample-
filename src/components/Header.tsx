/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Video, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { UsageQuota } from '../types';

interface HeaderProps {
  currentTab: 'create' | 'library' | 'examples' | 'faq';
  onSelectTab: (tab: 'create' | 'library' | 'examples' | 'faq') => void;
  usage: UsageQuota | null;
  onOpenUsage: () => void;
  onOpenPrivacy: () => void;
  onOpenSetup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  usage,
  onOpenUsage,
  onOpenPrivacy,
  onOpenSetup,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('create');
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Video className="w-4 h-4" />
          </div>
          <span>VividClip</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-xs sm:text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectTab('create')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'create'
                ? 'text-white font-semibold bg-neutral-800/60'
                : 'hover:text-neutral-200'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => onSelectTab('library')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'library'
                ? 'text-white font-semibold bg-neutral-800/60'
                : 'hover:text-neutral-200'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => onSelectTab('examples')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'examples'
                ? 'text-white font-semibold bg-neutral-800/60'
                : 'hover:text-neutral-200'
            }`}
          >
            Showcase
          </button>
          <button
            onClick={() => onSelectTab('faq')}
            className={`hidden md:block px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'faq'
                ? 'text-white font-semibold bg-neutral-800/60'
                : 'hover:text-neutral-200'
            }`}
          >
            Limits & FAQ
          </button>
        </nav>

        {/* Zone 3: Actions & Quota Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenUsage}
            title="View remaining daily generations & reset schedule"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-all whitespace-nowrap group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono tabular-nums font-semibold text-amber-400">
              {usage ? usage.remaining : 3}
            </span>
            <span className="hidden sm:inline text-neutral-400">/ 3 free today</span>
          </button>

          <button
            onClick={onOpenSetup}
            title="API Setup & Architecture Guide"
            className="p-1.5 sm:p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
            aria-label="Setup guide and model configuration"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPrivacy}
            title="Privacy and Responsible AI Policy"
            className="hidden sm:flex p-1.5 sm:p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
            aria-label="Privacy policy"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
