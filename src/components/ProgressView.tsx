/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Loader2,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Edit3,
  XCircle,
  CheckCircle2,
  Layers,
  Ratio,
  ShieldAlert,
} from 'lucide-react';
import { VideoJob } from '../types';
import { api } from '../services/api';

interface ProgressViewProps {
  jobId: string;
  onJobCompleted: (job: VideoJob) => void;
  onCancel: () => void;
  onRetry: () => void;
  onEditPrompt: (prompt: string, style: string, aspectRatio: any) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  jobId,
  onJobCompleted,
  onCancel,
  onRetry,
  onEditPrompt,
}) => {
  const [job, setJob] = useState<VideoJob | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Poll job status
  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const data = await api.getJob(jobId);
        if (!isMounted) return;
        setJob(data);

        if (data.status === 'completed') {
          onJobCompleted(data);
          return;
        }

        if (data.status === 'failed') {
          return;
        }

        // Continue polling every 2.5 seconds
        timer = setTimeout(fetchStatus, 2500);
      } catch (err: any) {
        if (!isMounted) return;
        setPollError(err.message || 'Error updating job progress');
        timer = setTimeout(fetchStatus, 4000);
      }
    };

    fetchStatus();

    const elapsedTimer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(elapsedTimer);
    };
  }, [jobId, onJobCompleted]);

  const handleCancelClick = async () => {
    try {
      await api.cancelJob(jobId);
      onCancel();
    } catch (e) {
      onCancel();
    }
  };

  const steps = [
    { title: 'Queue & Allocation', desc: 'Validating prompt & free queue position', threshold: 10 },
    { title: 'Motion Dynamics', desc: 'Synthesizing scene continuity & lighting', threshold: 35 },
    { title: 'Frame Rendering', desc: 'Interpolating temporal frames & colors', threshold: 70 },
    { title: 'Final Packaging', desc: 'Encoding 720p MP4 & preview link', threshold: 95 },
  ];

  const currentProgress = job ? job.progress : 10;
  const estimatedTotal = 50;
  const estimatedRemaining = Math.max(0, estimatedTotal - elapsedSeconds);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm">
        {/* Header Status */}
        {job?.status === 'failed' ? (
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center mx-auto mb-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Generation Failed</h2>
            <p className="text-red-300 text-sm max-w-md mx-auto">
              {job.error || 'A temporary issue occurred while rendering your video. You may retry or refine your prompt.'}
            </p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Generating your video...
            </h2>
            <p className="text-neutral-400 text-sm">
              {job?.step || 'Allocating compute resources in the free queue...'}
            </p>
          </div>
        )}

        {/* Progress Bar (when not failed) */}
        {job?.status !== 'failed' && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-medium text-neutral-300">Rendering Progress</span>
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Est. remaining: ~{estimatedRemaining}s</span>
                </span>
                <span className="font-mono tabular-nums font-semibold text-amber-400">
                  {currentProgress}%
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Multi-step Visual Pipeline */}
        {job?.status !== 'failed' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
            {steps.map((st, i) => {
              const isCompleted = currentProgress > st.threshold;
              const isCurrent = currentProgress >= st.threshold - 20 && currentProgress <= st.threshold;
              return (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCompleted
                      ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
                      : isCurrent
                      ? 'bg-amber-400/10 border-amber-400/50 text-white'
                      : 'bg-neutral-950/30 border-neutral-900 text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0" />
                    )}
                    <span className="text-xs font-semibold truncate">{st.title}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 line-clamp-1">{st.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Prompt & Settings Card */}
        {job && (
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 mb-6 text-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="font-semibold text-neutral-300 uppercase tracking-wider text-[10px]">
                Active Generation Parameters
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {job.aspectRatio}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {job.duration}s
                </span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {job.style}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  720p HD
                </span>
              </div>
            </div>
            <p className="text-neutral-200 text-sm italic">
              "{job.prompt}"
            </p>
          </div>
        )}

        {/* Background Reassurance Note */}
        {job?.status !== 'failed' && (
          <p className="text-center text-xs text-neutral-500 mb-6">
            You can safely switch tabs or browse the library; your video job is saved and will continue rendering.
          </p>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {job?.status === 'failed' ? (
            <>
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
              {job && (
                <button
                  type="button"
                  onClick={() => onEditPrompt(job.prompt, job.style, job.aspectRatio)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Prompt</span>
                </button>
              )}
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2.5 text-neutral-400 hover:text-neutral-200 text-xs transition-colors"
              >
                Cancel & Return
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 text-xs font-medium transition-colors"
            >
              Cancel Generation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
