import React, { useEffect, useState } from 'react';
import { Trash2, Clock, Search } from 'lucide-react';
import { useWatchHistory, useYouTube } from '../hooks/useYouTube';
import VideoCard from '../components/VideoCard/VideoCard';
import { YouTubeVideo } from '../types/youtube';

const History: React.FC = () => {
  const { history, clearHistory } = useWatchHistory();
  const { getVideoDetails, loading } = useYouTube();
  const [historyVideos, setHistoryVideos] = useState<YouTubeVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistoryVideos();
  }, [history]);

  const loadHistoryVideos = async () => {
    if (history.length === 0) {
      setHistoryVideos([]);
      return;
    }

    const videoPromises = history.slice(0, 50).map(videoId => getVideoDetails(videoId));
    const videos = await Promise.all(videoPromises);
    const validVideos = videos.filter(video => video !== null) as YouTubeVideo[];
    setHistoryVideos(validVideos);
  };

  const filteredVideos = historyVideos.filter(video =>
    video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.snippet.channelTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (videoId: string) => {
    // Since we don't store timestamps, we'll use a mock recent time
    const index = history.indexOf(videoId);
    const hoursAgo = index + 1;
    return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Watch History</h1>
          <p className="text-gray-400">Videos you've watched recently</p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search */}
      {history.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search your history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* History Content */}
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
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Watch History</h3>
          <p className="text-gray-400 mb-4">
            Videos you watch will appear here
          </p>
          <p className="text-gray-500 text-sm">
            Start watching videos to build your history
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
        <div className="space-y-6">
          {/* Timeline View */}
          <div className="space-y-4">
            {filteredVideos.map((video, index) => (
              <div key={`${video.id.videoId}-${index}`} className="flex space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div className="flex-shrink-0">
                  <img
                    src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className="w-48 aspect-video object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-2 line-clamp-2">
                    {video.snippet.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-2">
                    {video.snippet.channelTitle}
                  </p>
                  
                  <div className="flex items-center text-gray-500 text-sm space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Watched {formatDate(video.id.videoId)}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                    {video.snippet.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;