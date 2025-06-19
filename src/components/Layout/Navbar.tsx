import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, User, Bell, Video } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '../../utils/constants';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              {APP_CONFIG.name}
            </span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search videos, channels, playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;