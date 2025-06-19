import { useState, useEffect } from 'react';
import { youtubeService } from '../services/youtube';
import { YouTubeVideo, YouTubePlaylist } from '../types/youtube';

export const useYouTube = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithErrorHandling = async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchVideos: (query: string, maxResults?: number) =>
      fetchWithErrorHandling(() => youtubeService.searchVideos(query, maxResults)),
    getTrendingVideos: (maxResults?: number) =>
      fetchWithErrorHandling(() => youtubeService.getTrendingVideos(maxResults)),
    getVideoDetails: (videoId: string) =>
      fetchWithErrorHandling(() => youtubeService.getVideoDetails(videoId)),
    getRelatedVideos: (videoId: string, maxResults?: number) =>
      fetchWithErrorHandling(() => youtubeService.getRelatedVideos(videoId, maxResults)),
    getPlaylists: (channelId?: string, maxResults?: number) =>
      fetchWithErrorHandling(() => youtubeService.getPlaylists(channelId, maxResults)),
    getShorts: (maxResults?: number) =>
      fetchWithErrorHandling(() => youtubeService.getShorts(maxResults)),
  };
};

// Local storage hooks for liked videos and history
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

export const useLikedVideos = () => {
  const [likedVideos, setLikedVideos] = useLocalStorage<string[]>('edizoplay_liked_videos', []);

  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const isLiked = (videoId: string) => likedVideos.includes(videoId);

  return { likedVideos, toggleLike, isLiked };
};

export const useWatchHistory = () => {
  const [history, setHistory] = useLocalStorage<string[]>('edizoplay_watch_history', []);

  const addToHistory = (videoId: string) => {
    setHistory(prev => {
      const filtered = prev.filter(id => id !== videoId);
      return [videoId, ...filtered].slice(0, 100); // Keep last 100 videos
    });
  };

  const clearHistory = () => setHistory([]);

  return { history, addToHistory, clearHistory };
};