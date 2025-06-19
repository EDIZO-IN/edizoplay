import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import Shorts from './pages/Shorts';
import Playlists from './pages/Playlists';
import History from './pages/History';
import LikedVideos from './pages/LikedVideos';
import Search from './pages/Search';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import { ROUTES } from './utils/constants';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar onMenuToggle={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SHORTS} element={<Shorts />} />
            <Route path={ROUTES.PLAYLISTS} element={<Playlists />} />
            <Route path={ROUTES.HISTORY} element={<History />} />
            <Route path={ROUTES.LIKED} element={<LikedVideos />} />
            <Route path={ROUTES.SEARCH} element={<Search />} />
            <Route path={ROUTES.WATCH} element={<VideoPlayer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;