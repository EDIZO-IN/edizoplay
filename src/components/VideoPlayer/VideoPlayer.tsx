import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, Share, Download, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { useYouTube, useLikedVideos, useWatchHistory } from '../../hooks/useYouTube';
import RelatedVideos from './RelatedVideos';

const VideoPlayer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const isShorts = searchParams.get('shorts') === 'true';
  
  const { getVideoDetails, getRelatedVideos } = useYouTube();
  const { toggleLike, isLiked } = useLikedVideos();
  const { addToHistory } = useWatchHistory();
  
  const [video, setVideo] = React.useState<any>(null);
  const [relatedVideos, setRelatedVideos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (videoId) {
      loadVideoData();
      addToHistory(videoId);
    }
  }, [videoId]);

  const loadVideoData = async () => {
    if (!videoId) return;
    
    setLoading(true);
    
    try {
      const [videoData, relatedData] = await Promise.all([
        getVideoDetails(videoId),
        getRelatedVideos(videoId, 20)
      ]);
      
      setVideo(videoData);
      setRelatedVideos(relatedData || []);
    } catch (error) {
      console.error('Error loading video data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">No video selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-video bg-gray-800 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-800 rounded mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Video not found</p>
      </div>
    );
  }

  return (
    <div className={`${isShorts ? 'max-w-sm mx-auto' : 'max-w-7xl mx-auto'} px-4 py-6`}>
      <div className={`grid gap-6 ${isShorts ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Video Player Section */}
        <div className={isShorts ? 'col-span-1' : 'col-span-1 lg:col-span-2'}>
          {/* Video Player */}
          <div className={`relative ${isShorts ? 'aspect-[9/16]' : 'aspect-video'} bg-black rounded-lg overflow-hidden mb-4`}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={video.snippet.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-white leading-tight">
              {video.snippet.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {video.snippet.channelTitle.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{video.snippet.channelTitle}</p>
                    <p className="text-gray-400 text-sm">
                      {video.statistics && `${formatViewCount(video.statistics.viewCount)} views`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleLike(videoId)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    isLiked(videoId)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked(videoId) ? 'fill-current' : ''}`} />
                  <span>Like</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                {video.statistics && (
                  <span>{formatViewCount(video.statistics.viewCount)} views</span>
                )}
                <span>{formatDate(video.snippet.publishedAt)}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {video.snippet.description.slice(0, 300)}
                {video.snippet.description.length > 300 && '...'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Videos Section */}
        {!isShorts && (
          <div className="col-span-1">
            <RelatedVideos videos={relatedVideos} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;