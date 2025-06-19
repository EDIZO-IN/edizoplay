import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Lock, Globe } from 'lucide-react';
import { useYouTube } from '../hooks/useYouTube';
import { YouTubePlaylist } from '../types/youtube';

const Playlists: React.FC = () => {
  const { getPlaylists, loading } = useYouTube();
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    const result = await getPlaylists(undefined, 20);
    if (result) {
      setPlaylists(result);
    }
  };

  // Mock playlists for demo since YouTube API requires authentication for user playlists
  const mockPlaylists = [
    {
      id: 'liked',
      title: 'Liked Videos',
      description: 'Videos you have liked',
      thumbnail: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=300',
      videoCount: 0,
      isPrivate: false
    },
    {
      id: 'watch-later',
      title: 'Watch Later',
      description: 'Videos to watch later',
      thumbnail: 'https://images.pexels.com/photos/3137078/pexels-photo-3137078.jpeg?auto=compress&cs=tinysrgb&w=300',
      videoCount: 0,
      isPrivate: true
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      description: 'Your favorite videos collection',
      thumbnail: 'https://images.pexels.com/photos/3850970/pexels-photo-3850970.jpeg?auto=compress&cs=tinysrgb&w=300',
      videoCount: 0,
      isPrivate: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Your Playlists</h1>
        <p className="text-gray-400">Organize your favorite videos into collections</p>
      </div>

      {/* Create Playlist Button */}
      <div className="mb-8">
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Create New Playlist
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockPlaylists.map((playlist) => (
          <div key={playlist.id} className="group cursor-pointer">
            <div className="relative">
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white bg-opacity-20 rounded-full p-3 backdrop-blur-sm">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {playlist.videoCount} videos
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex items-start justify-between">
                <h3 className="text-white font-medium group-hover:text-gray-300 transition-colors">
                  {playlist.title}
                </h3>
                <div className="flex items-center text-gray-400">
                  {playlist.isPrivate ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {playlist.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* API Playlists */}
      {playlists.length > 0 && (
        <>
          <div className="mt-12 mb-6">
            <h2 className="text-xl font-bold text-white">Public Playlists</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="group cursor-pointer">
                <div className="relative">
                  <img
                    src={playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default.url}
                    alt={playlist.snippet.title}
                    className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white bg-opacity-20 rounded-full p-3 backdrop-blur-sm">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {playlist.contentDetails?.itemCount || 0} videos
                  </div>
                </div>
                
                <div className="mt-3">
                  <h3 className="text-white font-medium group-hover:text-gray-300 transition-colors">
                    {playlist.snippet.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {playlist.snippet.channelTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {!loading && playlists.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Public playlists will appear here when available
          </p>
        </div>
      )}
    </div>
  );
};

export default Playlists;