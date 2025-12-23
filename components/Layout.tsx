
import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold italic text-white">S</div>
            <span className="text-xl font-bold tracking-tight text-white">Squeeze<span className="text-indigo-500">Code</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/compress-video-for-discord" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Discord (8MB)</Link>
            <Link to="/25mb-video-compressor" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Nitro (25MB)</Link>
          </nav>
          <div className="flex items-center gap-3">
             <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-all">
                Buy Me Coffee ☕
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-white font-bold mb-4">SqueezeCode</h3>
            <p className="text-slate-500 text-sm">
              The privacy-first video compressor. 100% client-side processing using FFmpeg.wasm.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="text-slate-500 text-sm space-y-2">
              <li><Link to="/8mb-video-compressor" className="hover:text-indigo-400">8MB Compressor</Link></li>
              <li><Link to="/25mb-video-compressor" className="hover:text-indigo-400">25MB Compressor</Link></li>
              <li><Link to="/compress-video-for-discord" className="hover:text-indigo-400">Discord Tool</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Privacy</h3>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Zero Server Uploads
            </div>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-slate-900/50">
          <p className="text-slate-600 text-xs">&copy; {new Date().getFullYear()} SqueezeCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
