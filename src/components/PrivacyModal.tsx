/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Shield, Lock, Trash2, EyeOff, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Privacy & Safety Policy</h3>
            <p className="text-xs text-neutral-400">How your prompts, uploads, and videos are protected</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-neutral-300 mb-6">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span>Zero Model Training</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Your prompt texts, reference images, and generated videos are never used to train or fine-tune public AI foundation models.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <Trash2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Deletion Rights</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              You maintain full control. Clicking "Delete" immediately purges the video file and its metadata from our servers and memory cache. In addition, all clips automatically expire and are purged after 48 hours.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>No Account Requirement</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              We do not harvest emails, passwords, or personal credentials. Session limits are managed through an anonymous client-side identifier without tracking across other websites.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Safety & Responsible AI Policy</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              We enforce strict server-side content filters. Generation of non-consensual sexual content, child abuse material (CSAM), violence, hate speech, or deceptive impersonation is strictly prohibited and blocked automatically.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
