"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { cacheArticleResults, getCachedArticleResults, cacheArticle } from "./newsCache";

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  alert?: string;
  timezone: number; 
  forecast?: { date: string; temp: number; condition: string }[];
}

export interface NewsData {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  sourceId: string;
  publishedAt?: string;
  imageUrl?: string;
  country?: string;
}

interface DataContextType {
  weatherData: WeatherData | { error: string } | null;
  newsData: NewsData[] | { error: string } | null;
  searchData: NewsData[] | { error: string } | null;
  isLoading: boolean;
  newsMode: 'headlines' | 'all';
  setNewsMode: (mode: 'headlines' | 'all') => void;
  refreshNews: (mode?: 'headlines' | 'all') => Promise<void>; 
  updateSearch: (query: string) => Promise<NewsData[] | { error: string }>;
  updateWeather: (city: string) => Promise<WeatherData | { error: string }>;
  updateWeatherByCoords: (lat: number, lon: number) => Promise<WeatherData | { error: string }>;   
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
  initialWeatherData: WeatherData | { error: string } | null;
  initialNewsData: NewsData[] | { error: string } | null;
  initialSearchData?: NewsData[] | { error: string } | null;
}

// Helper function for fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 50000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export function DataProvider({
  children,
  initialWeatherData,
  initialNewsData,
  initialSearchData = null,
}: DataProviderProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | { error: string } | null>(initialWeatherData);
  const [newsData, setNewsData] = useState<NewsData[] | { error: string } | null>(initialNewsData);
  const [searchData, setSearchData] = useState<NewsData[] | { error: string } | null>(initialSearchData);
  const [isLoading, setIsLoading] = useState(false);
  const [newsMode, setNewsMode] = useState<'headlines' | 'all'>('headlines');
  
  useEffect(() => {
    if (newsData && !("error" in newsData)) {
      newsData.forEach(article => cacheArticle(article));
    }
  }, [newsData]);

  const updateWeather = useCallback(async (city: string) => {
    setIsLoading(true);
    try {
      const res = await fetchWithTimeout(`/api/weather?city=${encodeURIComponent(city)}`, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server weather fetch failed: ${res.status} ${errorText}`);
      }
      const newWeather = await res.json();
      setWeatherData(newWeather);
      return newWeather;
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'Weather request timed out. Please try again.' 
        : error instanceof Error ? error.message : 'Failed to fetch weather data';
      
      const errorObj = { error: errorMessage };
      setWeatherData(errorObj);
      return errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const res = await fetchWithTimeout(`/api/weather?lat=${lat}&lon=${lon}`, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server weather fetch failed: ${res.status} ${errorText}`);
      }
      const newWeather = await res.json();
      setWeatherData(newWeather);
      return newWeather;
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'Weather request timed out. Please try again.' 
        : error instanceof Error ? error.message : 'Failed to fetch weather data';
      
      const errorObj = { error: errorMessage };
      setWeatherData(errorObj);
      return errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchData(null);
      return [];
    }
    
    // Check cache first
    const cachedResults = getCachedArticleResults(query);
    if (cachedResults) {
      setSearchData(cachedResults);
      return cachedResults;
    }
    setIsLoading(true);
    try {
      const res = await fetchWithTimeout(`/api/search-result?query=${encodeURIComponent(query)}`, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Search failed: ${res.status} ${errorText}`);
      }
      const newSearchResults = await res.json();
      
      if (!("error" in newSearchResults)) {
        cacheArticleResults(query, newSearchResults);
        setSearchData(newSearchResults);
      } else {
        setSearchData(newSearchResults);
      }
      
      return newSearchResults;
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'Search request timed out. Please try again.' 
        : error instanceof Error ? error.message : 'Failed to fetch search results';
      
      const errorObj = { error: errorMessage };
      setSearchData(errorObj);
      return errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshNews = useCallback(async (mode?: 'headlines' | 'all') => {
    const currentMode = mode || newsMode;
    setIsLoading(true);
    try {
      const cachedNews = getCachedArticleResults(currentMode === 'headlines' ? 'headlines' : 'all');
      if (cachedNews && cachedNews.length > 0) {
        setNewsData(cachedNews);
      }
      const endpoint = currentMode === 'headlines' ? '/api/news/headlines' : '/api/news/all';
      const res = await fetchWithTimeout(endpoint, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`News API failed: ${res.status} ${errorText}`);
      }

      const newNews = await res.json();
      if (!("error" in newNews)) {
        setNewsData(newNews);
        cacheArticleResults(currentMode === 'headlines' ? 'headlines' : 'all', newNews);
      } else {
        setNewsData(newNews);
      }
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'News refresh timed out. Using cached data.' 
        : 'Failed to refresh news. Using cached data if available.';
      
      // Try to get cached data as fallback
      const cachedNews = getCachedArticleResults(newsMode === 'headlines' ? 'headlines' : 'all');
      if (!cachedNews || cachedNews.length === 0) {
        setNewsData({ error: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  }, [newsMode]);

  return (
    <DataContext.Provider value={{ 
      weatherData, 
      newsData, 
      searchData,
      isLoading,
      newsMode,
      setNewsMode,
      updateWeather, 
      updateWeatherByCoords, 
      updateSearch,
      refreshNews
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}