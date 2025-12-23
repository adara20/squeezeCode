
import { CompressionPreset } from './types';

export const PRESETS: CompressionPreset[] = [
  {
    id: 'discord-8',
    name: 'Discord Basic',
    targetSizeMB: 8,
    description: 'Perfect for standard Discord accounts.',
    icon: '🎮'
  },
  {
    id: 'email-20',
    name: 'Email Standard',
    targetSizeMB: 20,
    description: 'Safe for most email attachments.',
    icon: '📧'
  },
  {
    id: 'discord-25',
    name: 'Discord Nitro',
    targetSizeMB: 25,
    description: 'The Nitro limit for high-quality sharing.',
    icon: '🚀'
  }
];

export const MAX_INPUT_SIZE_MB = 500;
export const FFMPEG_CORE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
