
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const getFFmpeg = async (onLog?: (message: string) => void) => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  if (onLog) {
    ffmpeg.on('log', ({ message }) => onLog(message));
  }

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export const calculateBitrate = (targetSizeMB: number, durationSec: number): number => {
  // Target Size in bits = MB * 1024 * 1024 * 8
  // Buffer 5% for container overhead
  const targetBits = targetSizeMB * 1024 * 1024 * 8 * 0.95;
  const bitrate = Math.floor(targetBits / durationSec);
  // Ensure a minimum bitrate of 100kbps to avoid total failure
  return Math.max(bitrate, 100000);
};

export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(file);
  });
};
