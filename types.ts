
export interface CompressionPreset {
  id: string;
  name: string;
  targetSizeMB: number;
  description: string;
  icon: string;
}

export interface VideoMetadata {
  name: string;
  size: number;
  type: string;
  duration: number;
}

export enum CompressionStatus {
  IDLE = 'IDLE',
  LOADING_FFMPEG = 'LOADING_FFMPEG',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
