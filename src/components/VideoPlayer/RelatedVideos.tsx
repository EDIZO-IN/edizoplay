import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import { YouTubeVideo } from '../../types/youtube';
import { ROUTES } from '../../utils/constants';

interface RelatedVideosProps {
  videos: YouTubeVideo[];
}

const RelatedVideos: React.FC<RelatedVideosProps> = ({ videos }) => {
  const formatViewCount = (count: string | undefined) => {
    if (!count) return '0 views';
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  if (videos.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Related Videos</h3>
        <p className="text-gray-400">No related videos found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Related Videos</h3>
      
      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            key={video.id.videoId}
            to={`${ROUTES.WATCH}?v=${video.id.videoId}`}
            className="flex space-x-3 group hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <div className="flex-shrink-0 relative">
              <img
                src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="w-40 aspect-video object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
                {video.snippet.title}
              </h4>
              
              <p className="text-gray-400 text-xs mt-1 hover:text-white cursor-pointer">
                {video.snippet.channelTitle}
              </p>
              
              <div className="flex items-center space-x-2 mt-1 text-gray-400 text-xs">
                {video.statistics && (
                  <>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatViewCount(video.statistics.viewCount)}</span>
                    </div>
                    <span>•</span>
                  </>
                )}
                <span>
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;