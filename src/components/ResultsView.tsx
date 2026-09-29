/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Download,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  Sparkles,
  Film,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import { VideoJob } from '../types';

interface ResultsViewProps {
  currentJob: VideoJob | null;
  allJobs: VideoJob[];
  onRegenerate: (job: VideoJob) => void;
  onEditPrompt: (prompt: string, style: string, aspectRatio: any) => void;
  onDeleteJob: (id: string) => void;
  onCreateNew: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  currentJob,
  allJobs,
  onRegenerate,
  onEditPrompt,
  onDeleteJob,
  onCreateNew,
}) => {
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(
    currentJob || (allJobs.length > 0 ? allJobs[0] : null)
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Update selected if currentJob changes
  React.useEffect(() => {
    if (currentJob) {
      setSelectedJob(currentJob);
    } else if (allJobs.length > 0 && !selectedJob) {
      setSelectedJob(allJobs[0]);
    }
  }, [currentJob, allJobs]);

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Helper to format remaining hours
  const formatExpiration = (expiresAt: number) => {
    const diffHours = Math.max(0, Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60)));
    if (diffHours <= 0) return 'Expiring soon';
    if (diffHours < 24) return `Expires in ${diffHours}h`;
    return `Expires in ${Math.ceil(diffHours / 24)}d`;
  };

  // Compute aspect ratio container classes
  const getAspectRatioClass = (ratio: string) => {
    if (ratio === '9:16') return 'aspect-[9/16] max-h-[520px]';
    if (ratio === '1:1') return 'aspect-square max-h-[460px]';
    return 'aspect-video max-h-[440px]';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Banner / Create New Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Video Studio & Library
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Preview, download, and manage your AI-generated clips
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Video</span>
        </button>
      </div>

      {/* Main Selected Video Player Card */}
      {selectedJob && (
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-6 mb-10 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Video Viewport */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                className={`relative w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center ${getAspectRatioClass(
                  selectedJob.aspectRatio
                )}`}
              >
                <video
                  ref={videoRef}
                  src={`/api/video/${selectedJob.id}`}
                  className="w-full h-full object-contain cursor-pointer"
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={togglePlay}
                />

                {/* Subtle watermark in bottom-right corner for free tier */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-neutral-300 pointer-events-none select-none border border-white/10">
                  VividClip Free Tier
                </div>

                {/* Floating Play Overlay Button if paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-amber-400/90 hover:bg-amber-300 text-neutral-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    aria-label="Play video"
                  >
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </button>
                )}

                {/* Quick Player Bar */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-1 rounded hover:bg-white/20 transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-1 rounded hover:bg-white/20 transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px] text-neutral-300">
                      0:0{selectedJob.duration} HD
                    </span>
                  </div>

                  <button
                    onClick={toggleFullScreen}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Metadata & Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div>
                {/* Meta tags */}
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                  <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
                    {selectedJob.style}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-neutral-300">{selectedJob.aspectRatio}</span>
                  <span>·</span>
                  <span className="font-mono text-neutral-300">{selectedJob.duration}s</span>
                  <span>·</span>
                  <span className="text-neutral-400">720p HD</span>
                </div>

                {/* Prompt */}
                <h2 className="text-base sm:text-lg font-medium text-neutral-100 mb-4 leading-relaxed">
                  "{selectedJob.prompt}"
                </h2>

                {/* Expiration Note */}
                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-400 mb-6 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-300 font-medium">Temporary Cloud Preview: </span>
                    <span>
                      {formatExpiration(selectedJob.expiresAt)}. Download your MP4 file below to keep it permanently on your device.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-800">
                <a
                  href={`/api/video/${selectedJob.id}?download=1`}
                  download={`vividclip_${selectedJob.id}.mp4`}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-amber-400/10"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4 Video</span>
                </a>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleCopyPrompt(selectedJob.prompt, selectedJob.id)}
                    className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    title="Copy Prompt"
                  >
                    {copiedId === selectedJob.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Prompt</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onRegenerate(selectedJob)}
                    className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    title="Regenerate with same settings"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rerun</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(selectedJob.id)}
                    className="py-2.5 px-3 rounded-xl bg-neutral-800/60 hover:bg-red-950/40 hover:text-red-400 text-neutral-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Library Grid: All Generated Clips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span>Generated Clips</span>
            <span className="text-xs font-mono text-neutral-500 font-normal">
              ({allJobs.length})
            </span>
          </h2>
        </div>

        {allJobs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
            <Film className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-300 font-medium text-sm mb-1">No videos generated yet</p>
            <p className="text-neutral-500 text-xs max-w-sm mx-auto mb-4">
              Enter a prompt in the Create studio to generate your first free short video.
            </p>
            <button
              onClick={onCreateNew}
              className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-medium text-xs hover:bg-amber-300 transition-colors"
            >
              Start Creating
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-400/80 shadow-md shadow-amber-400/5'
                      : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  {/* Thumbnail / Mini Video View */}
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-950 mb-3 border border-neutral-800 flex items-center justify-center">
                    <video
                      src={`/api/video/${job.id}`}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-mono text-neutral-300">
                      {job.aspectRatio} · {job.duration}s
                    </div>
                  </div>

                  {/* Metadata */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="font-semibold text-neutral-300 truncate">{job.style}</span>
                      <span className="font-mono text-[10px] text-amber-400/90">
                        {formatExpiration(job.expiresAt)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 line-clamp-2 mb-3">
                      "{job.prompt}"
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-xs">
                    <a
                      href={`/api/video/${job.id}?download=1`}
                      download={`vividclip_${job.id}.mp4`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-neutral-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRegenerate(job);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded hover:bg-neutral-800 transition-colors"
                        title="Regenerate"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal(job.id);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Delete Video Permanently?</h3>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              This will remove the video file and its prompt from our temporary cloud storage immediately. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
              >
                Keep Video
              </button>
              <button
                type="button"
                onClick={() => {
                  if (showDeleteModal) {
                    onDeleteJob(showDeleteModal);
                    if (selectedJob?.id === showDeleteModal) {
                      const remaining = allJobs.filter((j) => j.id !== showDeleteModal);
                      setSelectedJob(remaining.length > 0 ? remaining[0] : null);
                    }
                    setShowDeleteModal(null);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
