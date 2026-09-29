/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  X,
  Play,
  Clock,
  ShieldAlert,
  Sliders,
  Layers,
  Ratio,
  Info,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { AspectRatio, Duration, UsageQuota, AppConfig } from '../types';
import { STYLE_OPTIONS, EXAMPLE_PROMPTS } from '../constants';

interface CreateViewProps {
  onStartGeneration: (payload: {
    prompt: string;
    aspectRatio: AspectRatio;
    duration: Duration;
    style: string;
    resolution: '720p' | '1080p';
    referenceImage?: string;
    mode: 'veo' | 'demo';
  }) => void;
  usage: UsageQuota | null;
  config: AppConfig | null;
  initialPrompt?: string;
  initialStyle?: string;
  initialAspectRatio?: AspectRatio;
}

export const CreateView: React.FC<CreateViewProps> = ({
  onStartGeneration,
  usage,
  config,
  initialPrompt = '',
  initialStyle = 'Cinematic',
  initialAspectRatio = '16:9',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(initialAspectRatio);
  const [duration, setDuration] = useState<Duration>(5);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<'veo' | 'demo'>('veo');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRemainingEmpty = usage ? usage.remaining <= 0 : false;
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleImageFile = (file: File) => {
    setErrorMsg(null);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setErrorMsg('Only PNG, JPG, or WebP images are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
      setImageFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleInspireMe = () => {
    const random = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(random.prompt);
    setAspectRatio(random.aspectRatio);
    setSelectedStyle(random.style);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = prompt.trim();
    if (!trimmed) {
      setErrorMsg('Please describe the video you want to generate.');
      return;
    }

    if (isRemainingEmpty) {
      setErrorMsg('Daily free generation limit reached. Quota resets at midnight UTC.');
      return;
    }

    onStartGeneration({
      prompt: trimmed,
      aspectRatio,
      duration,
      style: selectedStyle,
      resolution: '720p',
      referenceImage: referenceImage || undefined,
      mode: generationMode,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Welcome Headline */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 font-display">
          Turn an idea into a video.
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
          Create cinematic short clips in seconds using Google Veo AI. Free to use with transparent limits and instant MP4 downloads.
        </p>
      </div>

      {/* Main Creation Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm"
      >
        {/* Error notification */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Prompt Input Box */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prompt-input" className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <span>Prompt Description</span>
              <span className="text-amber-400">*</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-mono font-medium">
                Unlimited Words
              </span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInspireMe}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Inspire me</span>
              </button>
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="prompt-input"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video without word limits: scene sequence, camera trajectory, subject actions, atmosphere, lighting..."
              className="w-full rounded-xl bg-neutral-950/70 border border-neutral-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-neutral-100 placeholder-neutral-500 text-sm sm:text-base p-3.5 min-h-[110px] resize-y transition-all outline-none"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1.5 text-xs text-neutral-500">
              <span className="truncate">Be as detailed as you like: full stories, multi-step actions & cinematography.</span>
              <div className="flex items-center gap-1.5 font-mono tabular-nums text-neutral-400 shrink-0">
                <span className="text-amber-400 font-semibold">{wordCount}</span>
                <span>{wordCount === 1 ? 'word' : 'words'}</span>
                <span>({prompt.length} chars)</span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">∞ Unlimited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Reference Image Area (Image-to-Video) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-semibold text-neutral-300 flex items-center gap-1.5">
              <span>Reference Image (Optional)</span>
              <span className="text-xs text-neutral-500 font-normal">· Image-to-Video starting frame</span>
            </label>
          </div>

          {!referenceImage ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  handleImageFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-amber-400 bg-amber-400/5'
                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 hover:bg-neutral-950/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
                }}
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Upload className="w-5 h-5 text-neutral-400" />
                <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-neutral-500">
                  Supports PNG, JPG, or WebP up to 5MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={referenceImage}
                  alt="Reference preview"
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-700 shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-medium text-neutral-200 truncate">{imageFileName || 'reference_image.png'}</p>
                  <p className="text-xs text-emerald-400">Attached as initial motion frame</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReferenceImage(null);
                  setImageFileName(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Video Settings Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 pt-2 border-t border-neutral-800/80">
          {/* Aspect Ratio */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Ratio className="w-3.5 h-3.5 text-amber-400" />
              <span>Aspect Ratio</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: '16:9', label: '16:9', desc: 'Landscape' },
                  { id: '9:16', label: '9:16', desc: 'Vertical' },
                  { id: '1:1', label: '1:1', desc: 'Square' },
                ] as const
              ).map((ratio) => (
                <button
                  type="button"
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                    aspectRatio === ratio.id
                      ? 'bg-amber-400/10 border-amber-400 text-white font-semibold shadow-sm'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-mono text-sm">{ratio.label}</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">{ratio.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Duration</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { sec: 5, label: '5 Seconds', desc: 'Fast Free Tier' },
                  { sec: 7, label: '7 Seconds', desc: 'Extended Take' },
                ] as const
              ).map((d) => (
                <button
                  type="button"
                  key={d.sec}
                  onClick={() => setDuration(d.sec)}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                    duration === d.sec
                      ? 'bg-amber-400/10 border-amber-400 text-white font-semibold shadow-sm'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-mono text-sm">{d.label}</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality & Engine Mode */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Quality & Engine</span>
            </label>
            <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-neutral-400">Resolution:</span>
                <span className="font-semibold text-neutral-200">720p HD (Free Cap)</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                <span className="text-neutral-400">Engine:</span>
                <select
                  value={generationMode}
                  onChange={(e) => setGenerationMode(e.target.value as 'veo' | 'demo')}
                  className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-amber-400 text-xs font-medium outline-none focus:border-amber-400"
                >
                  <option value="veo">Google Veo 3.1</option>
                  <option value="demo">High-Speed Demo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Style Selection */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Visual Style</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {STYLE_OPTIONS.map((style) => (
              <button
                type="button"
                key={style.id}
                onClick={() => setSelectedStyle(style.name)}
                className={`py-2 px-2.5 rounded-xl text-left border transition-all ${
                  selectedStyle === style.name
                    ? 'bg-neutral-800/90 border-amber-400 text-white shadow-sm'
                    : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: style.accentColor }}
                  />
                  <span className="text-xs font-semibold text-neutral-200 truncate">{style.name}</span>
                </div>
                <p className="text-[10px] text-neutral-500 line-clamp-1">{style.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Transparent Free-Tier & Policy Notice */}
        <div className="mb-6 p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800/80 text-xs text-neutral-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-semibold text-neutral-300">Free Tier Notice: </span>
              <span>
                3 daily clips · ~45-60s queue · 720p HD · Discreet corner watermark · 48h cloud retention
              </span>
            </div>
          </div>
          <div className="text-neutral-500 shrink-0 text-[11px] font-mono">
            {usage?.remaining ?? 3} clips left today
          </div>
        </div>

        {/* Primary Action Button */}
        <div>
          <button
            type="submit"
            disabled={isRemainingEmpty}
            className={`w-full py-3.5 sm:py-4 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
              isRemainingEmpty
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-400/10 active:scale-[0.99] cursor-pointer'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isRemainingEmpty
                ? 'Daily Free Limit Reached (Resets at 00:00 UTC)'
                : `Generate Video (${usage ? usage.remaining : 3} free left)`}
            </span>
          </button>
        </div>
      </form>

      {/* Example Prompts Gallery Section */}
      <div className="mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Inspiration Showcase
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Browse examples created with VividClip and try them with one tap
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXAMPLE_PROMPTS.map((ex, idx) => (
            <div
              key={idx}
              className="group p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-semibold text-white">{ex.title}</span>
                  <span className="text-neutral-500 font-mono text-[11px]">
                    {ex.style} · {ex.aspectRatio} · {ex.duration}s
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                  "{ex.prompt}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-xs">
                <span className="text-amber-400/90 text-[11px]">Free Tier Spec</span>
                <button
                  type="button"
                  onClick={() => {
                    setPrompt(ex.prompt);
                    setAspectRatio(ex.aspectRatio);
                    setSelectedStyle(ex.style);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <span>Use Prompt</span>
                  <Sparkles className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
