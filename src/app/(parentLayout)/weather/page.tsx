"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbSearch, TbRefresh } from "react-icons/tb";
import { useData } from "@/lib/DataContext";
import { formatTimeForTimezone } from "@/lib/timeUtils";

export default function WeatherPage() {
    const { weatherData, updateWeather, isLoading: contextLoading } = useData();
    const [city, setCity] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle city search
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

    // Handle refresh
    const handleRefresh = async () => {
        if (weatherData && !("error" in weatherData)) {
            setIsLoading(true);
            await updateWeather(weatherData.city);
            setIsLoading(false);
        }
    };

    // Time formatting
    const { day, date, time } = weatherData && !("error" in weatherData) && "timezone" in weatherData && weatherData.timezone
        ? formatTimeForTimezone(weatherData.timezone)
        : ({
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
        });

    const showWeatherInput = !weatherData || "error" in weatherData;

    // Loading state
    if (contextLoading && !weatherData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3">Loading weather...</span>
            </div>
        );
    }

    return (
        <div className="parent mt-[40px] mb-[40px]">
            <Card className="bg-[#2563eb] hover:shadow-lg min-h-[80vh]">
                <CardHeader className="pb-2 text-center">
                    <CardTitle>
                        <img src="/images/sun_cloud.png" alt="Cloud and Sun Icon" className="inline-block w-[100px]" />
                        <h2 className="lg:text-[28px] text-white">Weather Highlight</h2>
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="flex flex-col items-center justify-center text-center mt-[10px]">
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleCitySubmit} className="font-medium text-[#708090] bg-white rounded-[15px] py-[10px] px-[10px] my-[5px] sm:min-w-[350px] min-w-[60%] w-fit flex items-center justify-between">
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
                        {!showWeatherInput && (
                            <button 
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="p-2 text-white bg-blue-700 rounded-full hover:bg-blue-800 disabled:opacity-50"
                            >
                                <TbRefresh className="text-xl" />
                            </button>
                        )}
                    </div>
                </CardContent>

                {showWeatherInput ? (
                    <p className="text-center text-white my-[5px] w-[80%] mx-auto">
                        {weatherData && "error" in weatherData && weatherData.error}
                    </p>
                ) : (
                    <CardContent className="flex flex-col md:flex-row gap-x-[3%] gap-y-4 justify-center text-center">
                        <div className="w-full md:w-[30%] rounded-[20px] bg-[#F9FAFB] p-[15px] flex flex-col items-center justify-center">
                            <p className="font-semibold text-center text- bg-yellow-400 w-fit rounded-[15px] py-[5px] px-[10px] my-[5px]">
                                {weatherData.city}: {weatherData.temp}°C, {weatherData.condition}
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-700">
                                {day}, {date} | {time}
                            </p>
                            <p className="mt-1 text-sm text-gray-600 font-medium">
                                {weatherData.alert || "Expect clear skies today!"}
                            </p>
                        </div>
                        
                        <div className="w-full md:w-[50%] rounded-[20px] bg-[#F9FAFB] p-[15px] flex flex-col items-center">
                            <p className="font-semibold text-center w-fit text-[18px] my-[5px]">
                                Weekly Forecast
                            </p>
                            <div className="flex overflow-x-auto justify-evenly w-full gap-2 py-2">
                                {weatherData.forecast?.map((day, index) => (
                                    <div key={index} className="flex flex-col items-center bg-[#e1e3ea] p-3 rounded-[10px] min-w-[80px]">
                                        <span className="text-[12px] font-medium">{day.date}</span>
                                        <span className="text-[14px] font-bold text-gray-800">{day.temp}°C</span>
                                        <span className="text-[12px] font-medium text-gray-600 text-center">{day.condition}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}