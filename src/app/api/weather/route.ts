import { NextRequest, NextResponse } from "next/server";
import { fetchWeather, fetchWeatherByCoords } from "@/lib/api";

const cache: { [key: string]: { data: unknown; timestamp: number } } = {};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const cacheKey = city ? `city:${city}` : `coords:${lat},${lon}`;
  const cacheEntry = cache[cacheKey];
  
  // Return cached data if it exists and is less than 10 minutes old
  if (cacheEntry && Date.now() - cacheEntry.timestamp < 600000) {
    return NextResponse.json(cacheEntry.data);
  }

  try {
    let data;
    if (city) {
      data = await fetchWeather(city);
    } else if (lat && lon) {
      data = await fetchWeatherByCoords(parseFloat(lat), parseFloat(lon));
    } else {
      return NextResponse.json({ error: "Missing city or coordinates" }, { status: 400 });
    }
    
    // Update cache with new data
    cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: "Server error while fetching weather" }, { status: 500 });
  }
}