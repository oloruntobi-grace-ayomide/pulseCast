"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/lib/DataContext";
import { NewsData } from '@/lib/api';
import { formatNewsDate } from '@/lib/dateUtils';

export default function SearchPage() {
  const { updateSearch, searchData, isLoading } = useData();
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchParams = useSearchParams();

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Handle URL query parameters on page load
  useEffect(() => {
    const urlQuery = searchParams.get('q');  
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      updateSearch(urlQuery);
      saveToHistory(urlQuery);
    }
  }, [searchParams, query, updateSearch]);
  
  // Save search to history
  const saveToHistory = (searchQuery: string) => {
    const filteredHistory = searchHistory.filter(item => item !== searchQuery);
    const newHistory = [searchQuery, ...filteredHistory].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    updateSearch(historyQuery);
    saveToHistory(historyQuery);
  };

  return (
    <div className="parent mt-[40px] mb-[40px]">
      <Card className="border-none rounded-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary-color">
            Search Results {query && `for "${query}"`}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(historyItem)}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                    disabled={isLoading}
                  >
                    {historyItem}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">{`Searching for "${query}"...`}</p>
            </div>
          ) : searchData === null ? (
            <div className="text-center text-gray-500 py-8">
              <p>Enter a search term in the navbar to find news articles</p>
            </div>
          ) : "error" in searchData ? (
            <div className="text-center text-red-600 py-8">
              <p>Error: {searchData.error}</p>
              <button
                onClick={() => updateSearch(query)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
                disabled={isLoading}
              >
                Try Again
              </button>
            </div>
          ) : searchData.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>{`No results found for "${query}"`}</p>
              </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {`${searchData.length} result${searchData.length !== 1 ? 's' : ''} found for "${query}"`}
                
              </h3>
              {searchData.map((news: NewsData) => (
                <div key={news.id} className="p-4 transition-shadow border rounded-lg hover:shadow-md">
                    <div className="flex flex-col items-center gap-4 md:flex-row">
                        {/* News Image */}
                        {news.imageUrl && (
                            <div className="w-full overflow-hidden rounded-lg h-[170px] md:w-[300px]">
                                <img
                                    src={news.imageUrl || "/favicon/pulsecast.png"}
                                    alt={news.title}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                    e.currentTarget.src = "/favicon/pulsecast.png";
                                  }}
                                />
                            </div>
                        )}
                    
                        {/* News Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                                {news.country && (
                                    <>
                                        <span className="px-2 py-1 text-red-600 rounded"> {news.country.toUpperCase()} </span>
                                        <span>•</span>
                                    </>
                                )}
                                <span className="font-medium">{news.source}</span>
                                {news.publishedAt && (
                                    <>
                                    <span>•</span>
                                    <span>{formatNewsDate(news.publishedAt)}</span>
                                    </>
                                )}
                            </div>
                            
                            <h3 className="mb-1 font-semibold text-gray-900 transition-colors text-[16.5px] hover:text-primary-color-light">
                                <Link href={`/news/${news.id}?fromSearch=true&q=${encodeURIComponent(query)}`}>{news.title}</Link>
                            </h3>
                        
                            <p className="mb-2 text-gray-700 line-clamp-2">{news.description}</p>
                            
                            {/* Read More Link */}
                            <Link href={`/news/${news.id}?fromSearch=true&q=${encodeURIComponent(query)}`} 
                            className="inline-block font-medium text-blue-600 hover:underline">Read Full Story →</Link>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}