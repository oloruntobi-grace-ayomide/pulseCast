"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbSearch } from "react-icons/tb";
import { useData } from "@/lib/DataContext";
import { formatTimeForTimezone } from "@/lib/timeUtils";
import { NewsData } from '@/lib/api';

export default function HighlightCards() {
    const { weatherData, newsData, updateWeather, refreshNews } = useData();
    const [city, setCity] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTimedOut, setIsTimedOut] = useState(false);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
        if (newsData === null) { 
            setIsTimedOut(true);
        }
        }, 50000);

        return () => clearTimeout(timeoutId);
    }, [newsData]);

    const handleRetry = () => {
        setIsTimedOut(false);
        refreshNews();
    };

    // Handle button click
    const handleCitySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;
        setIsLoading(true);
        try {
        const result = await updateWeather(city.trim());
        if ("city" in result && result.city) {
            localStorage.setItem("lastCity", result.city);
            setCity("");
        }
        } finally {
        setIsLoading(false);
        }
    };

    const { day, date, time } = weatherData && !("error" in weatherData) && "timezone" in weatherData && weatherData.timezone
    ? formatTimeForTimezone(weatherData.timezone)
    : {
        day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
        date: new Date().toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
        }),
        time: new Date().toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: true 
        })
    };
    const showWeatherInput = !weatherData || "error" in weatherData;

  return (
    <div className="parent grid grid-cols-1 gap-4 py-6 mx-auto my-[20px] md:grid-cols-2">
      {/* Weather Card */}
        <Card className="transition-shadow bg-[#2563eb] hover:shadow-lg md:h-[320px] flex flex-col items-center justify-center">
            <CardHeader className="pb-2 text-center">
            <CardTitle>
                <img src="/images/sun_cloud.png" alt="Cloud and Sun Icon" className="inline-block lg:w-[100px] xxsm:w-[65px]" />
                <h2 className="lg:text-[28px] xxsm:text-[22px] text-white">Weather Highlight</h2>
            </CardTitle>
            </CardHeader>
            {showWeatherInput ? (
                <CardContent className="flex flex-col items-center justify-center text-center">
                    <form onSubmit={handleCitySubmit} className="font-medium text-[#708090] bg-white rounded-[15px] py-[10px] px-[10px] my-[5px] lg:min-w-[50%] xxsm:min-w-[70%] w-fit mx-auto flex items-center justify-between">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name"
                        className="outline-none flex-1 mr-[10px] text-black"
                        readOnly={isLoading}
                    />
                    <button type="submit" className="flex items-center justify-center text-primary-color" disabled={isLoading}>
                        {isLoading ? <span className="loader submiting-search border-2 w-[13px] h-[13px]"></span>: <TbSearch className="text-[18px] text-primary-color font-bold" />}
                    </button>
                    </form>
                    <p className="text-center text-white text-[15px] my-[5px] sm:w-[80%] xxsm:w-[95%] xxsm:text-[14px] mx-auto">
                        {weatherData && "error" in weatherData
                        ? weatherData.error
                        : "Location not detected. Enter your city in the field above to see weather."}
                    </p>
                </CardContent>
                ):(
                <CardContent className="flex flex-col items-center justify-center text-center">
                    <p className="font-semibold text-center text-[#708090] bg-white sm:rounded-[15px] xxsm:rounded-[12px] sm:py-[10px] xxsm:py-[7px] px-[10px] my-[5px]">
                        {weatherData.city}: {weatherData.temp}°C, {weatherData.condition}
                    </p>
                    <p className="mt-1 sm:text-sm xxsm:text-[12.3px] text-gray-200">
                        {day}, {date} | {time}
                    </p>
                    <p className="mt-1 sm:text-sm xxsm:text-[12.3px] text-yellow-400">
                        {weatherData.alert || "Expect clear skies today!"}
                    </p>
                    <Link href="/weather" className="inline-block mt-1 sm:text-sm xxsm:text-[12.3px] font-medium text-cyan-300 hover:underline">
                        See details
                    </Link>
                </CardContent>
            )}
        </Card>

        {/* News Card */}
        <Card className="transition-shadow bg-gray-100 hover:shadow-lg md:h-[320px] flex flex-col items-center relative">
    
            {newsData && !("error" in newsData) && newsData.length > 0 && (
                <Link href="/news" className="absolute right-[10px] sm:text-[14.5px] text-sm top-[5px] inline-block text-blue-600 hover:underline">
                See all news
                </Link>
            )}
            
            <CardHeader className="pb-2 text-center">
                <CardTitle>
                <img src="/images/newspaper.png" alt="Newspaper Icon" className="inline-block lg:w-[80px] xxsm:w-[60px]" />
                <h2 className="lg:text-[28px] xxsm:text-[22px] text-blue-600 mt-[3px]">Top Stories</h2>
                </CardTitle>
            </CardHeader>

            {newsData === null && !isTimedOut ?  (
                <CardContent className="w-full">
                    <p className="text-center sm:text-[15px] text-sm text-gray-600 my-[5px] w-[80%] mx-auto">
                        Loading news...
                    </p>
                </CardContent>
            ) : isTimedOut ? (
                <div className="py-8 text-center">
                    <p className="text-red-600 mb-4 text-[15px] my-[5px] sm:w-[80%] xxsm:w-[95%] xxsm:text-[14px] mx-auto">News loading is taking too long.</p>
                    <p className="text-gray-600 mb-4 text-[15px] my-[5px] sm:w-[80%] xxsm:w-[95%] xxsm:text-[14px] mx-auto">This might be due to API limits or network issues.</p>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            ) : newsData && "error" in newsData ? (
                <CardContent className="w-full text-center">
                <p className="text-gray-600 my-[5px] sm:w-[80%] xxsm:w-[95%] sm:text-[15px] xxsm:text-[14px] mx-auto">
                    {newsData.error}
                </p>
                 <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
                </CardContent>
            ) : newsData && newsData.length >= 2 ? (
                <CardContent className="w-full">
                {newsData.slice(0, 2).map((news: NewsData) => (
                    <div key={news.id} className="rounded-[10px] bg-white py-1 px-2 [&:not(:last-child)]:mb-[10px]">
                        <p className="font-semibold sm:line-clamp-1 sm:text-[15px] text-[14px]">{news.title || "Breaking News"}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 sm:line-clamp-2">
                            {news.description?.slice(0, 100) || "Stay updated with the latest stories."}...
                            <Link href={`/news/${news.id}`} className="inline-block font-medium text-blue-600 hover:underline">
                            See More
                            </Link>
                        </p>
                    </div>
                ))}
                </CardContent>
            ) : newsData ? (
                <CardContent className="w-full">
                <p className="text-center text-gray-600 my-[5px] text-[15px] my-[5px] sm:w-[80%] xxsm:w-[95%] xxsm:text-[14px] mx-auto">
                    No news articles available at the moment.
                </p>
                </CardContent>
            ) : (
                <CardContent className="w-full">
                <p className="text-center text-gray-600 my-[5px] text-[15px] my-[5px] sm:w-[80%] xxsm:w-[95%] xxsm:text-[14px] mx-auto">
                    Unexpected state occurred.
                </p>
                </CardContent>
            )}
        </Card>
    </div>
  );
}