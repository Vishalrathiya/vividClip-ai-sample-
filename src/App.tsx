/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CreateView } from './components/CreateView';
import { ProgressView } from './components/ProgressView';
import { ResultsView } from './components/ResultsView';
import { ShowcaseView } from './components/ShowcaseView';
import { FaqView } from './components/FaqView';
import { UsageModal } from './components/UsageModal';
import { PrivacyModal } from './components/PrivacyModal';
import { SetupModal } from './components/SetupModal';
import { api } from './services/api';
import { AppConfig, UsageQuota, VideoJob, AspectRatio, Duration } from './types';
import { Sparkles, Video, Film, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'create' | 'library' | 'examples' | 'faq'>('create');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [usage, setUsage] = useState<UsageQuota | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(() => {
    return localStorage.getItem('vividclip_active_job_id');
  });
  const [currentJob, setCurrentJob] = useState<VideoJob | null>(null);
  const [allJobs, setAllJobs] = useState<VideoJob[]>([]);

  // Pre-fill state when clicking "Use Prompt" or "Edit Prompt"
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftStyle, setDraftStyle] = useState('Cinematic');
  const [draftAspectRatio, setDraftAspectRatio] = useState<AspectRatio>('16:9');

  // Modals
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const [cfg, usg, jobs] = await Promise.all([
          api.getConfig(),
          api.getUsage(),
          api.getJobs(),
        ]);
        setConfig(cfg);
        setUsage(usg);
        setAllJobs(jobs);

        // Check if there is a pending active job
        const savedJobId = localStorage.getItem('vividclip_active_job_id');
        if (savedJobId) {
          const found = jobs.find((j) => j.id === savedJobId);
          if (found && (found.status === 'queued' || found.status === 'processing')) {
            setActiveJobId(savedJobId);
          } else {
            localStorage.removeItem('vividclip_active_job_id');
            setActiveJobId(null);
            if (found && found.status === 'completed') {
              setCurrentJob(found);
            }
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    init();
  }, []);

  const refreshUsageAndJobs = async () => {
    try {
      const [usg, jobs] = await Promise.all([api.getUsage(), api.getJobs()]);
      setUsage(usg);
      setAllJobs(jobs);
    } catch (e) {
      console.error('Error refreshing state:', e);
    }
  };

  const handleStartGeneration = async (payload: {
    prompt: string;
    aspectRatio: AspectRatio;
    duration: Duration;
    style: string;
    resolution: '720p' | '1080p';
    referenceImage?: string;
    mode: 'veo' | 'demo';
  }) => {
    try {
      const result = await api.generateVideo(payload);
      setActiveJobId(result.jobId);
      localStorage.setItem('vividclip_active_job_id', result.jobId);
      refreshUsageAndJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to start video generation.');
    }
  };

  const handleJobCompleted = (completedJob: VideoJob) => {
    setActiveJobId(null);
    localStorage.removeItem('vividclip_active_job_id');
    setCurrentJob(completedJob);
    setAllJobs((prev) => [completedJob, ...prev.filter((j) => j.id !== completedJob.id)]);
    setCurrentTab('library');
    refreshUsageAndJobs();
  };

  const handleCancelActiveJob = () => {
    setActiveJobId(null);
    localStorage.removeItem('vividclip_active_job_id');
    setCurrentTab('create');
    refreshUsageAndJobs();
  };

  const handleRetryJob = () => {
    if (activeJobId) {
      const job = allJobs.find((j) => j.id === activeJobId);
      if (job) {
        handleStartGeneration({
          prompt: job.prompt,
          aspectRatio: job.aspectRatio,
          duration: job.duration,
          style: job.style,
          resolution: job.resolution,
          mode: job.mode,
        });
      }
    }
  };

  const handleEditPrompt = (prompt: string, style: string, aspectRatio: AspectRatio) => {
    setDraftPrompt(prompt);
    setDraftStyle(style);
    setDraftAspectRatio(aspectRatio);
    setActiveJobId(null);
    localStorage.removeItem('vividclip_active_job_id');
    setCurrentTab('create');
  };

  const handleRegenerate = (job: VideoJob) => {
    handleStartGeneration({
      prompt: job.prompt,
      aspectRatio: job.aspectRatio,
      duration: job.duration,
      style: job.style,
      resolution: job.resolution,
      mode: job.mode,
    });
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await api.deleteJob(jobId);
      setAllJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (currentJob?.id === jobId) {
        setCurrentJob(null);
      }
    } catch (e) {
      console.error('Failed to delete job:', e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950 pb-20 sm:pb-12">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
        usage={usage}
        onOpenUsage={() => setIsUsageModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenSetup={() => setIsSetupModalOpen(true)}
      />

      {/* Active Job Progress Overlay or Banner */}
      {activeJobId && currentTab !== 'create' && (
        <div className="bg-amber-400/10 border-b border-amber-400/30 px-4 py-2.5 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>A video is currently generating in the background.</span>
          <button
            onClick={() => setCurrentTab('create')}
            className="underline font-semibold text-white hover:text-amber-200 ml-1"
          >
            View Progress
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {activeJobId && currentTab === 'create' ? (
          <ProgressView
            jobId={activeJobId}
            onJobCompleted={handleJobCompleted}
            onCancel={handleCancelActiveJob}
            onRetry={handleRetryJob}
            onEditPrompt={handleEditPrompt}
          />
        ) : (
          <>
            {currentTab === 'create' && (
              <CreateView
                onStartGeneration={handleStartGeneration}
                usage={usage}
                config={config}
                initialPrompt={draftPrompt}
                initialStyle={draftStyle}
                initialAspectRatio={draftAspectRatio}
              />
            )}

            {currentTab === 'library' && (
              <ResultsView
                currentJob={currentJob}
                allJobs={allJobs}
                onRegenerate={handleRegenerate}
                onEditPrompt={handleEditPrompt}
                onDeleteJob={handleDeleteJob}
                onCreateNew={() => setCurrentTab('create')}
              />
            )}

            {currentTab === 'examples' && (
              <ShowcaseView onUsePrompt={handleEditPrompt} />
            )}

            {currentTab === 'faq' && (
              <FaqView
                usage={usage}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
                onOpenSetup={() => setIsSetupModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-400">VividClip AI</span>
            <span>·</span>
            <span>Free AI Video Studio</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy & Retention
            </button>
            <span>·</span>
            <button
              onClick={() => setIsUsageModalOpen(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Daily Limits
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Setup & API
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Bottom Bar for Ergonomics (Touch-First PWA) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 grid grid-cols-4 h-14 items-center">
        <button
          onClick={() => setCurrentTab('create')}
          className={`flex flex-col items-center justify-center h-full text-[10px] font-medium transition-colors ${
            currentTab === 'create' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Video className="w-4 h-4 mb-0.5" />
          <span>Create</span>
        </button>

        <button
          onClick={() => setCurrentTab('library')}
          className={`flex flex-col items-center justify-center h-full text-[10px] font-medium transition-colors ${
            currentTab === 'library' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Film className="w-4 h-4 mb-0.5" />
          <span>Library</span>
        </button>

        <button
          onClick={() => setCurrentTab('examples')}
          className={`flex flex-col items-center justify-center h-full text-[10px] font-medium transition-colors ${
            currentTab === 'examples' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Showcase</span>
        </button>

        <button
          onClick={() => setIsUsageModalOpen(true)}
          className="flex flex-col items-center justify-center h-full text-[10px] font-medium text-neutral-400 hover:text-white transition-colors"
        >
          <span className="font-mono text-xs font-bold text-amber-400">
            {usage ? usage.remaining : 3}/3
          </span>
          <span className="text-[9px] text-neutral-500">Free Daily</span>
        </button>
      </div>

      {/* Modals */}
      <UsageModal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        usage={usage}
      />
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <SetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        hasApiKey={Boolean(config?.hasApiKey)}
      />
    </div>
  );
}
