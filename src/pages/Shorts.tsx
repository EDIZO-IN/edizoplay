import React, { useEffect, useState } from 'react';
import { useYouTube } from '../hooks/useYouTube';
import ShortsCard from '../components/VideoCard/ShortsCard';
import { YouTubeVideo } from '../types/youtube';

const Shorts: React.FC = () => {
  const { getShorts, searchVideos, loading } = useYouTube();
  const [shorts, setShorts] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    loadShorts();
  }, []);

  const loadShorts = async () => {
    // Try to get shorts, fallback to short duration videos
    let result = await getShorts(24);
    
    if (!result || result.length === 0) {
      // Fallback: search for short videos
      result = await searchVideos('#shorts OR "short video" OR "quick video"', 24);
    }
    
    if (result) {
      setShorts(result);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Shorts</h1>
        <p className="text-gray-400">Quick, vertical videos to watch on the go</p>
      </div>

      {/* Shorts Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[9/16] bg-gray-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {shorts.map((short) => (
            <ShortsCard
              key={short.id.videoId}
              video={short}
            />
          ))}
        </div>
      )}
      
      {!loading && shorts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No shorts found</p>
          <p className="text-gray-500 text-sm mt-2">
            Check back later for more short videos
          </p>
        </div>
      )}
    </div>
  );
};

export default Shorts;