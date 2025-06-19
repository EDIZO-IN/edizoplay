import React, { useEffect, useState } from 'react';
import { useYouTube } from '../hooks/useYouTube';
import VideoCard from '../components/VideoCard/VideoCard';
import { YouTubeVideo } from '../types/youtube';

const Home: React.FC = () => {
  const { getTrendingVideos, searchVideos, loading } = useYouTube();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [category, setCategory] = useState('trending');

  const categories = [
    { id: 'trending', label: 'Trending', query: '' },
    { id: 'music', label: 'Music', query: 'music' },
    { id: 'gaming', label: 'Gaming', query: 'gaming' },
    { id: 'sports', label: 'Sports', query: 'sports' },
    { id: 'news', label: 'News', query: 'news' },
    { id: 'technology', label: 'Technology', query: 'technology' },
    { id: 'entertainment', label: 'Entertainment', query: 'entertainment' },
  ];

  useEffect(() => {
    loadVideos();
  }, [category]);

  const loadVideos = async () => {
    const selectedCategory = categories.find(cat => cat.id === category);
    if (!selectedCategory) return;

    let result;
    if (selectedCategory.id === 'trending') {
      result = await getTrendingVideos(24);
    } else {
      result = await searchVideos(selectedCategory.query, 24);
    }
    
    if (result) {
      setVideos(result);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id.videoId}
              video={video}
              showChannel={true}
            />
          ))}
        </div>
      )}
      
      {!loading && videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No videos found</p>
          <p className="text-gray-500 text-sm mt-2">
            Please check your YouTube API configuration
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;