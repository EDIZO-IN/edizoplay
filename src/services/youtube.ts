import axios from 'axios';
import { YOUTUBE_API_KEY, YOUTUBE_API_BASE_URL } from '../utils/constants';
import { YouTubeVideo, YouTubePlaylist } from '../types/youtube';

// Axios instance for YouTube API
const api = axios.create({
  baseURL: YOUTUBE_API_BASE_URL, // Should be: 'https://www.googleapis.com/youtube/v3'
  params: {
    key: YOUTUBE_API_KEY,
  },
});

export const youtubeService = {
  // 🔍 Search videos by query
  searchVideos: async (query: string, maxResults = 20): Promise<YouTubeVideo[]> => {
    try {
      const response = await api.get('/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
          order: 'relevance',
        },
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  },

  // 🔥 Get trending videos (most popular)
  getTrendingVideos: async (maxResults = 50): Promise<YouTubeVideo[]> => {
    try {
      const response = await api.get('/videos', {
        params: {
          part: 'snippet,statistics',
          chart: 'mostPopular',
          regionCode: 'IN',
          maxResults,
        },
      });

      return (response.data.items || []).map((item: any) => ({
        id: { videoId: item.id },
        snippet: item.snippet,
        statistics: item.statistics,
      }));
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }
  },

  // 📺 Get video details by ID
  getVideoDetails: async (videoId: string): Promise<YouTubeVideo | null> => {
    try {
      const response = await api.get('/videos', {
        params: {
          part: 'snippet,statistics',
          id: videoId,
        },
      });

      const item = response.data.items?.[0];
      if (!item) return null;

      return {
        id: { videoId: item.id },
        snippet: item.snippet,
        statistics: item.statistics,
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  },

  // 📎 Get related videos (simulated by search)
  getRelatedVideos: async (videoId: string, maxResults = 10): Promise<YouTubeVideo[]> => {
    try {
      const videoDetails = await youtubeService.getVideoDetails(videoId);
      if (!videoDetails) return [];

      const searchQuery = videoDetails.snippet.title
        .split(' ')
        .slice(0, 4)
        .join(' ');
      return await youtubeService.searchVideos(searchQuery, maxResults);
    } catch (error) {
      console.error('Error fetching related videos:', error);
      return [];
    }
  },

  // 📂 Get playlists of a channel
  getPlaylists: async (channelId?: string, maxResults = 20): Promise<YouTubePlaylist[]> => {
    try {
      if (!channelId) return [];

      const response = await api.get('/playlists', {
        params: {
          part: 'snippet,contentDetails',
          channelId,
          maxResults,
        },
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  },

  // 📱 Get YouTube Shorts
  getShorts: async (maxResults = 20): Promise<YouTubeVideo[]> => {
    try {
      const response = await api.get('/search', {
        params: {
          part: 'snippet',
          q: '#shorts',
          type: 'video',
          maxResults,
          order: 'relevance',
          videoDuration: 'short',
        },
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching shorts:', error);
      return [];
    }
  },
};
