
import React from 'react';
import CompressorTool from '../components/CompressorTool';

interface LandingPageProps {
  title: string;
  targetSize: number;
}

const LandingPage: React.FC<LandingPageProps> = ({ title, targetSize }) => {
  return (
    <div className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <div className="inline-block bg-indigo-500/10 text-indigo-500 px-4 py-1 rounded-full text-sm font-bold mb-6">
          SEO Optimized Tool
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Instantly shrink your video to under {targetSize}MB without losing quality. 
          The #1 tool for {title.toLowerCase()} enthusiasts.
        </p>
      </div>

      <CompressorTool initialTargetSize={targetSize} />

      <article className="mt-32 max-w-3xl mx-auto prose prose-invert">
        <h2 className="text-2xl font-bold text-white mb-6">About the {targetSize}MB Limit</h2>
        <p className="text-slate-400 mb-6">
          Platform limits like the {targetSize}MB cap for Discord or Email exist to manage server load and bandwidth. 
          However, modern smartphone cameras often record at extremely high bitrates, resulting in files that are hundreds of megabytes 
          for just a few seconds of footage.
        </p>
        <h3 className="text-xl font-bold text-white mb-4">How SqueezeCode Helps</h3>
        <p className="text-slate-400 mb-6">
          Our <strong>{targetSize}mb video compressor</strong> uses professional-grade encoding libraries to re-encode your video. 
          By reducing the bitrate intelligently while keeping the resolution as high as possible, we can achieve massive file size 
          savings while maintaining great visual fidelity.
        </p>
        <ul className="text-slate-400 space-y-3 mb-6">
          <li><strong>Privacy:</strong> No data is ever sent to our servers. All processing happens on your CPU.</li>
          <li><strong>Speed:</strong> Powered by WebAssembly for the fastest browser-based encoding available.</li>
          <li><strong>Free:</strong> No subscriptions, no watermarks, no limits.</li>
        </ul>
      </article>
    </div>
  );
};

export default LandingPage;
