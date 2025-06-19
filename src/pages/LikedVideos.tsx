import React, { useEffect, useState } from 'react';
import { Heart, Search, Trash2 } from 'lucide-react';
import { useLikedVideos, useYouTube } from '../hooks/useYouTube';
import VideoCard from '../components/VideoCard/VideoCard';
import { YouTubeVideo } from '../types/youtube';

const LikedVideos: React.FC = () => {
  const { likedVideos, toggleLike } = useLikedVideos();
  const { getVideoDetails, loading } = useYouTube();
  const [likedVideoData, setLikedVideoData] = useState<YouTubeVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLikedVideos();
  }, [likedVideos]);

  const loadLikedVideos = async () => {
    if (likedVideos.length === 0) {
      setLikedVideoData([]);
      return;
    }

    const videoPromises = likedVideos.map(videoId => getVideoDetails(videoId));
    const videos = await Promise.all(videoPromises);
    const validVideos = videos.filter(video => video !== null) as YouTubeVideo[];
    setLikedVideoData(validVideos);
  };

  const filteredVideos = likedVideoData.filter(video =>
    video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.snippet.channelTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearAllLikes = () => {
    if (window.confirm('Are you sure you want to remove all liked videos?')) {
      likedVideos.forEach(videoId => toggleLike(videoId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Liked Videos</h1>
          <p className="text-gray-400">
            {likedVideos.length} {likedVideos.length === 1 ? 'video' : 'videos'} you've liked
          </p>
        </div>
        
        {likedVideos.length > 0 && (
          <button
            onClick={clearAllLikes}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Search */}
      {likedVideos.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search liked videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : likedVideos.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Liked Videos</h3>
          <p className="text-gray-400 mb-4">
            Videos you like will appear here
          </p>
          <p className="text-gray-500 text-sm">
            Tap the heart icon on any video to add it to your likes
          </p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
          <p className="text-gray-400">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id.videoId}
              video={video}
              showChannel={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;