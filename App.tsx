
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compress-video-for-discord" element={<LandingPage title="Compress Video for Discord" targetSize={8} />} />
          <Route path="/8mb-video-compressor" element={<LandingPage title="8MB Video Compressor" targetSize={8} />} />
          <Route path="/25mb-video-compressor" element={<LandingPage title="25MB Video Compressor" targetSize={25} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
