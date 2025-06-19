import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, Heart } from 'lucide-react';
import { YouTubeVideo } from '../../types/youtube';
import { useLikedVideos } from '../../hooks/useYouTube';
import { ROUTES } from '../../utils/constants';

interface ShortsCardProps {
  video: YouTubeVideo;
}

const ShortsCard: React.FC<ShortsCardProps> = ({ video }) => {
  const { toggleLike, isLiked } = useLikedVideos();
  const videoId = video.id.videoId;

  const formatViewCount = (count: string | undefined) => {
    if (!count) return '0';
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="group cursor-pointer relative">
      <Link to={`${ROUTES.WATCH}?v=${videoId}&shorts=true`}>
        <div className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url}
            alt={video.snippet.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">
              {video.snippet.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white text-xs">
                {video.statistics && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatViewCount(video.statistics.viewCount)}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleLike(videoId);
                }}
                className={`p-1.5 rounded-full transition-all ${
                  isLiked(videoId)
                    ? 'bg-red-600 text-white'
                    : 'bg-black bg-opacity-30 text-white hover:bg-red-600'
                }`}
              >
                <Heart 
                  className={`w-3 h-3 ${isLiked(videoId) ? 'fill-current' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShortsCard;