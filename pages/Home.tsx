
import React from 'react';
import CompressorTool from '../components/CompressorTool';

const Home: React.FC = () => {
  return (
    <div className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Squeeze videos for <span className="text-indigo-500">Discord</span> & <span className="text-indigo-500">Email</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          The only compressor that runs entirely in your browser. Fast, free, and private. 
          No more "File too large" errors.
        </p>
      </div>

      <CompressorTool />

      <section className="mt-32 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why use SqueezeCode?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-4">Better than Online Converters</h3>
            <p className="text-slate-400">
              Most "free" online compressors upload your private videos to their servers. 
              SqueezeCode uses FFmpeg.wasm to process everything locally. Your data never leaves your computer.
            </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-4">Precision Bitrate Targeting</h3>
            <p className="text-slate-400">
              Don't guess settings. Our algorithm calculates the exact bitrate needed to hit 8MB or 25MB limits 
              while maintaining the highest possible quality for your video length.
            </p>
          </div>
        </div>
      </section>
      
      {/* SEO Content Section */}
      <section className="mt-32 max-w-4xl mx-auto text-slate-500 text-sm leading-relaxed border-t border-slate-900 pt-16">
        <h2 className="text-white font-bold text-lg mb-4">Expert Guide: Compressing Video for Discord</h2>
        <p className="mb-4">
          Discord limits file uploads to 8MB for standard users and 25MB (recently updated from 50MB/100MB) for Nitro members. 
          When you have a 1080p gaming clip that's 200MB, you need a smart way to compress it. 
          SqueezeCode's <strong>8mb video compressor</strong> specifically targets these platform limits.
        </p>
        <p className="mb-4">
          <strong>How to compress a video to 8MB?</strong> Simply drag your file into our tool, select the "Discord Basic (8MB)" preset, 
          and our <strong>discord video compressor</strong> handles the rest using H.264 encoding. This ensures compatibility across all 
          devices—Desktop, iOS, and Android.
        </p>
      </section>
    </div>
  );
};

export default Home;
