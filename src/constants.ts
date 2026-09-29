/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StyleOption } from './types';

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: '35mm anamorphic look, rich atmospheric lighting & depth',
    iconName: 'Clapperboard',
    promptSuffix: 'cinematic 35mm film, anamorphic lens flares, rich color grading, dramatic lighting',
    accentColor: '#f59e0b',
  },
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Natural daylight, authentic textures & realistic physics',
    iconName: 'Camera',
    promptSuffix: 'photorealistic, ultra high detail, natural daylight, authentic material textures, 8k resolution',
    accentColor: '#10b981',
  },
  {
    id: 'animation_3d',
    name: '3D Render',
    description: 'Modern stylized 3D character animation, octane render',
    iconName: 'Box',
    promptSuffix: 'stylized 3D render, octane render, soft studio lighting, Pixar and DreamWorks aesthetic, smooth motion',
    accentColor: '#8b5cf6',
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Makoto Shinkai aesthetic, vibrant sky, expressive lighting',
    iconName: 'Sparkles',
    promptSuffix: 'anime aesthetic, Makoto Shinkai style, vibrant colors, detailed clouds, hand-drawn anime cinematography',
    accentColor: '#ec4899',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Fluid watercolor washes, organic paper texture & paint drips',
    iconName: 'Palette',
    promptSuffix: 'watercolor animation, soft fluid paint washes, paper grain texture, artistic impressionist brush strokes',
    accentColor: '#06b6d4',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic neon cityscapes, rain reflections & hologram glow',
    iconName: 'Zap',
    promptSuffix: 'cyberpunk neon city, rain reflections on pavement, holographic glows, dark atmospheric volumetric mist',
    accentColor: '#3b82f6',
  },
];

export const EXAMPLE_PROMPTS = [
  {
    title: 'Misty Redwood Forest',
    prompt: 'A gentle morning drone flight through towering ancient redwoods with sunlight beams cutting through golden fog',
    aspectRatio: '16:9' as const,
    duration: 5 as const,
    style: 'Cinematic',
    videoId: 'sample_forest',
  },
  {
    title: 'Rainy Cyberpunk Tokyo',
    prompt: 'A pedestrian holding a translucent umbrella walking through a glowing neon alleyway in Tokyo with vibrant rain reflections',
    aspectRatio: '9:16' as const,
    duration: 5 as const,
    style: 'Cyberpunk',
    videoId: 'sample_cyberpunk',
  },
  {
    title: 'Origami Fox Journey',
    prompt: 'A charming animated white origami paper fox bounding joyfully across pristine snowy winter hills',
    aspectRatio: '1:1' as const,
    duration: 5 as const,
    style: '3D Render',
    videoId: 'sample_origami',
  },
  {
    title: 'Cosmic Watercolor Whale',
    prompt: 'An ethereal humpback whale swimming gracefully through swirling pastel clouds of a starlit galaxy nebula',
    aspectRatio: '16:9' as const,
    duration: 5 as const,
    style: 'Watercolor',
    videoId: 'sample_watercolor',
  },
];
