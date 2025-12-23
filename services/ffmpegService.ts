
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
  const audioBitrate = 128000; // 128 kbps
  const targetBits = targetSizeMB * 1024 * 1024 * 8; // Total target size in bits
  const audioBits = audioBitrate * durationSec; // Total audio size in bits
  
  // Subtract audio size and apply 5% overhead buffer to the remaining video budget
  let videoBits = (targetBits - audioBits) * 0.95;

  if (videoBits <= 0) {
    // If target size is smaller than audio, or very close, 
    // we can't allocate much to video. Return a sensible minimum.
    // ffmpeg will do its best given the constraints.
    return 50000; // 50 kbps
  }

  const bitrate = Math.floor(videoBits / durationSec);
  // Ensure a minimum bitrate to avoid extremely poor quality or ffmpeg errors
  return Math.max(bitrate, 100000); // 100 kbps minimum
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
