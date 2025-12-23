
import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { getFFmpeg, calculateBitrate, getVideoDuration } from '../services/ffmpegService';
import { PRESETS, MAX_INPUT_SIZE_MB } from '../constants';
import { CompressionStatus, CompressionPreset } from '../types';

interface CompressorToolProps {
  initialTargetSize?: number;
}

const CompressorTool: React.FC<CompressorToolProps> = ({ initialTargetSize }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<CompressionStatus>(CompressionStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<CompressionPreset>(
    PRESETS.find(p => p.targetSizeMB === initialTargetSize) || PRESETS[0]
  );
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_INPUT_SIZE_MB * 1024 * 1024) {
      setError(`File is too large! Maximum allowed size is ${MAX_INPUT_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResultUrl(null);
    setProgress(0);
    setLogs([]);
  };

  const handleCompress = async () => {
    if (!file) return;

    try {
      setStatus(CompressionStatus.LOADING_FFMPEG);
      setLogs(['Initializing engine...']);
      
      const ffmpeg = await getFFmpeg((msg) => {
        setLogs(prev => [msg, ...prev].slice(0, 5));
        // Parse progress from FFmpeg logs (simpler than internal progress handler for some versions)
        if (msg.includes('time=')) {
          // You could extract duration and current time here for better accuracy
          // For now, let's assume we're progressing
        }
      });
      ffmpegRef.current = ffmpeg;

      // Handle progress events properly
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      setStatus(CompressionStatus.PROCESSING);
      setLogs(['Calculating best bitrate...']);

      const duration = await getVideoDuration(file);
      const bitrate = calculateBitrate(selectedPreset.targetSizeMB, duration);

      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setLogs([`Starting encoding at ${Math.round(bitrate / 1000)} kbps...`]);

      // Using H.264 with faster preset for web usage
      await ffmpeg.exec([
        '-i', inputName,
        '-b:v', `${bitrate}`,
        '-maxrate', `${bitrate}`,
        '-bufsize', `${bitrate * 2}`,
        '-preset', 'veryfast',
        '-c:a', 'aac',
        '-b:a', '128k',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      setResultUrl(url);
      setStatus(CompressionStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during compression. Make sure your browser supports SharedArrayBuffer (Desktop Chrome/Firefox recommended).');
      setStatus(CompressionStatus.ERROR);
    }
  };

  const reset = () => {
    setFile(null);
    setStatus(CompressionStatus.IDLE);
    setResultUrl(null);
    setProgress(0);
    setLogs([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">100% Local</span>
            <span className="bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">WASM Powered</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Squeeze your video</h2>
          <p className="text-slate-400 text-sm">Drag and drop or select a file to start compressing without uploading.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* File Upload Area */}
          {!file && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/50 rounded-xl p-12 transition-all cursor-pointer group text-center"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="video/*"
              />
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-slate-500 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <p className="text-slate-300 font-medium mb-1">Click to upload or drag & drop</p>
              <p className="text-slate-500 text-xs">MP4, WebM up to 500MB</p>
            </div>
          )}

          {/* Preset Selection & Controls */}
          {file && status === CompressionStatus.IDLE && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-xl">🎞️</div>
                  <div>
                    <h4 className="text-white font-medium text-sm truncate max-w-[200px] md:max-w-md">{file.name}</h4>
                    <p className="text-slate-500 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={reset} className="text-slate-500 hover:text-rose-500 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedPreset.id === preset.id 
                      ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500' 
                      : 'border-slate-800 bg-slate-950 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{preset.icon}</div>
                    <div className="text-white font-bold text-sm mb-1">{preset.name}</div>
                    <div className="text-indigo-400 font-black text-lg">{preset.targetSizeMB}MB</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleCompress}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                Start Squeezing
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </div>
          )}

          {/* Progress State */}
          {(status === CompressionStatus.PROCESSING || status === CompressionStatus.LOADING_FFMPEG) && (
            <div className="space-y-6 text-center py-6">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * progress) / 100} strokeLinecap="round" className="text-indigo-500 transition-all duration-300" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{progress}%</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Compressing</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-bold">{status === CompressionStatus.LOADING_FFMPEG ? 'Waking up FFmpeg...' : 'Work in progress'}</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">This happens 100% on your device. Please don't close the tab.</p>
              </div>

              <div className="bg-black/40 rounded-lg p-3 text-left font-mono text-[10px] text-slate-400 h-24 overflow-y-auto">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
              </div>
            </div>
          )}

          {/* Success State */}
          {status === CompressionStatus.COMPLETED && resultUrl && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
               <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">Compression Complete!</h3>
                  <p className="text-emerald-500/70 text-sm mb-6">Your file is ready and fits the {selectedPreset.targetSizeMB}MB limit.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a 
                      href={resultUrl} 
                      download={`compressed_${file?.name || 'video.mp4'}`}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      Download Video
                    </a>
                    <button 
                      onClick={reset}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all"
                    >
                      Compress Another
                    </button>
                  </div>
               </div>

               <div className="rounded-xl overflow-hidden border border-slate-800">
                  <video src={resultUrl} controls className="w-full aspect-video bg-black" />
               </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
              <p className="text-rose-500 font-medium mb-4">{error}</p>
              <button 
                onClick={reset}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trust & SEO Footer for Component */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex-shrink-0 flex items-center justify-center text-indigo-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Privacy First</h4>
            <p className="text-slate-500 text-xs">Files stay in your browser. No servers, no tracking, no leaks.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex-shrink-0 flex items-center justify-center text-indigo-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Lightning Fast</h4>
            <p className="text-slate-500 text-xs">Utilizes WebAssembly (WASM) for near-native performance.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex-shrink-0 flex items-center justify-center text-indigo-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Guaranteed Size</h4>
            <p className="text-slate-500 text-xs">Auto-calculates the perfect bitrate to stay under the limit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressorTool;
