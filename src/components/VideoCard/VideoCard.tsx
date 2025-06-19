import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Heart, Clock } from 'lucide-react';
import { YouTubeVideo } from '../../types/youtube';
import { useLikedVideos } from '../../hooks/useYouTube';
import { ROUTES } from '../../utils/constants';

interface VideoCardProps {
  video: YouTubeVideo;
  showChannel?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, showChannel = true }) => {
  const { toggleLike, isLiked } = useLikedVideos();
  const videoId = video.id.videoId;

  const formatViewCount = (count: string | undefined) => {
    if (!count) return '0 views';
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  const formatDuration = (publishedAt: string) => {
    try {
      return formatDistanceToNow(new Date(publishedAt), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative">
        <Link to={`${ROUTES.WATCH}?v=${videoId}`}>
          <img
            src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url}
            alt={video.snippet.title}
            className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg group-hover:rounded-none"></div>
        </Link>
        
        {/* Like button overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleLike(videoId);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
            isLiked(videoId)
              ? 'bg-red-600 text-white'
              : 'bg-black bg-opacity-50 text-white hover:bg-red-600'
          }`}
        >
          <Heart 
            className={`w-4 h-4 ${isLiked(videoId) ? 'fill-current' : ''}`} 
          />
        </button>
      </div>

      <div className="mt-3 flex space-x-3">
        {showChannel && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {video.snippet.channelTitle.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <Link to={`${ROUTES.WATCH}?v=${videoId}`}>
            <h3 className="text-white font-medium line-clamp-2 group-hover:text-gray-300 transition-colors">
              {video.snippet.title}
            </h3>
          </Link>
          
          {showChannel && (
            <p className="text-gray-400 text-sm mt-1 hover:text-white cursor-pointer">
              {video.snippet.channelTitle}
            </p>
          )}
          
          <div className="flex items-center space-x-2 mt-1 text-gray-400 text-sm">
            {video.statistics && (
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatViewCount(video.statistics.viewCount)}</span>
              </div>
            )}
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(video.snippet.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;