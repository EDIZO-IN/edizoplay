import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { useYouTube } from '../hooks/useYouTube';
import VideoCard from '../components/VideoCard/VideoCard';
import { YouTubeVideo } from '../types/youtube';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { searchVideos, loading } = useYouTube();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, sortBy]);

  const performSearch = async () => {
    const results = await searchVideos(query, 24);
    if (results) {
      let sortedResults = [...results];
      
      // Simple client-side sorting (YouTube API sorting is limited)
      if (sortBy === 'date') {
        sortedResults.sort((a, b) => 
          new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime()
        );
      } else if (sortBy === 'title') {
        sortedResults.sort((a, b) => 
          a.snippet.title.localeCompare(b.snippet.title)
        );
      }
      
      setVideos(sortedResults);
    }
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Upload Date' },
    { value: 'title', label: 'Title' },
    { value: 'views', label: 'View Count' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <SearchIcon className="w-6 h-6 text-gray-400" />
          <h1 className="text-2xl font-bold text-white">
            Search Results for "{query}"
          </h1>
        </div>
        
        {videos.length > 0 && (
          <p className="text-gray-400">
            Found {videos.length} results
          </p>
        )}
      </div>

      {/* Filters */}
      {query && (
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Sort by:</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-red-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results */}
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
      ) : !query ? (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Search EdizoPlay</h3>
          <p className="text-gray-400">
            Enter a search term to find videos, channels, and playlists
          </p>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
          <p className="text-gray-400 mb-4">
            No videos found for "{query}"
          </p>
          <p className="text-gray-500 text-sm">
            Try different keywords or check your spelling
          </p>
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
    </div>
  );
};

export default Search;