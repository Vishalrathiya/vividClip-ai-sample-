# VividClip AI - Free AI Video Creator

VividClip AI is a polished, mobile-friendly web application that allows users to create high-definition short videos for free using AI.

## Features

- **Simple Creation Flow**:
  - Prompt description box with unlimited words support, live word/character counter, and "Inspire me" generator.
  - Optional reference image attachment (PNG, JPG, WebP < 5MB) for image-to-video motion guidance.
  - Video aspect ratios: `16:9` (Landscape), `9:16` (Vertical / Shorts / TikTok / Reels), `1:1` (Square).
  - Video durations: 5 seconds (standard free) and 7 seconds (extended).
  - Visual styles: Realistic, Cinematic, 3D Render, Anime, Watercolor, Cyberpunk.
  - Output quality: 720p HD.
- **Transparent Free Tier**:
  - 3 free video clips per day per user session.
  - Resets daily at midnight 00:00 UTC.
  - Average queue wait time displayed before generating (~45-60 seconds).
  - Subtle corner watermark on free-tier clips ("VividClip Free Tier").
  - 48-hour temporary cloud preview storage with one-click permanent MP4 download.
- **Generation Progress Screen**:
  - Live status updates through the pipeline: Queue allocation -> Motion synthesis -> Temporal frames -> Stream packaging.
  - Estimated countdown timer and smooth progress indicator.
  - Background resilience: users can switch tabs or navigate to the library while generation completes.
  - Graceful error handling with retry and edit prompt options.
- **Video Studio & Library**:
  - HTML5 video player with custom playback controls, loop toggle, and fullscreen mode.
  - Direct MP4 video download (`/api/video/:id?download=1`).
  - Delete video with instant server-side purge.
  - One-click prompt copying and prompt regeneration.
- **Privacy & Responsible AI**:
  - Zero model training on user inputs or uploads.
  - Immediate file purge upon deletion and automatic 48-hour expiration.
  - Server-side safety filter blocking harmful, violent, CSAM, or non-consensual sexual content.
- **Robust Model Provider Architecture**:
  - Primary provider: Google Veo 3.1 Lite (`veo-3.1-lite-generate-preview`) via `@google/genai`.
  - High-Fidelity Demo Synthesizer: When running without an API key or when selected by the user, FFmpeg renders genuine 720p MP4 clips with motion dynamics, style-themed lighting, and watermarks.

## Getting Started

### Prerequisites

- Node.js (v18+)
- FFmpeg (installed for video stream processing and demo mode)

### Installation

```bash
npm install
```

### Environment Variables

Configure `.env` using `.env.example`:

```bash
# Optional: Google Gemini API key for Veo 3.1 Lite video generation
GEMINI_API_KEY="your-api-key"

# Port (defaults to 3000)
PORT=3000
```

### Running Locally

```bash
# Start development server (serves frontend and backend on port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

- `GET /api/config`: Service capabilities, active models, watermark policy, and retention rules.
- `GET /api/usage`: Current session's free generation count and reset schedule.
- `POST /api/safety/check`: Evaluates prompt safety against responsible AI rules.
- `POST /api/generate`: Queues video generation job with input validation and rate limiting.
- `GET /api/jobs`: Lists user's generated videos.
- `GET /api/jobs/:id`: Polls job status, progress step, and download URL.
- `POST /api/jobs/:id/cancel`: Cancels an in-progress generation job.
- `DELETE /api/jobs/:id`: Permanently purges a video from the server.
- `GET /api/video/:id`: Streams the MP4 video with HTTP 206 range requests or downloads with `?download=1`.
