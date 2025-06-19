import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  PlaySquare, 
  Clock, 
  Heart,
  List,
  TrendingUp,
  Music,
  Film,
  Gamepad2
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const mainLinks = [
    { to: ROUTES.HOME, icon: Home, label: 'Home' },
    { to: ROUTES.SHORTS, icon: PlaySquare, label: 'Shorts' },
    { to: ROUTES.PLAYLISTS, icon: List, label: 'Playlists' },
    { to: ROUTES.HISTORY, icon: Clock, label: 'History' },
    { to: ROUTES.LIKED, icon: Heart, label: 'Liked Videos' },
  ];

  const exploreLinks = [
    { to: '/trending', icon: TrendingUp, label: 'Trending' },
    { to: '/music', icon: Music, label: 'Music' },
    { to: '/movies', icon: Film, label: 'Movies' },
    { to: '/gaming', icon: Gamepad2, label: 'Gaming' },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) {
    return (
      <div className="fixed left-0 top-16 w-16 h-full bg-gray-900 border-r border-gray-800 z-40">
        <div className="flex flex-col items-center py-4 space-y-4">
          {mainLinks.slice(0, 3).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`p-3 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-16 w-64 h-full bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
      <div className="p-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-800"></div>

        {/* Explore Section */}
        <div className="space-y-1">
          <h3 className="text-gray-400 text-sm font-semibold mb-2 px-3">Explore</h3>
          {exploreLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs px-3">
            © 2024 EdizoPlay. Built with YouTube API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;