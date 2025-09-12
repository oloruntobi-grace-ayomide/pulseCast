import { generateIdFromUrl } from "./hashUtils";

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

export async function fetchWeather(city: string): Promise<WeatherData | { error: string }> {
  if (!process.env.OPENWEATHER_API_KEY) {
    return { error: "API configuration error. Please contact support." };
  }
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!weatherRes.ok) {
      const errData = await weatherRes.json();
      return { error: errData.message || "Weather API failed. Check city name or API key." };
    }

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!forecastRes.ok) {
      const errData = await forecastRes.json();
      return { error: errData.message || "Forecast API failed. Check city name or API key." };
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();
    const forecast = [];
    const uniqueDays = new Set();

    for (let i = 0; i < forecastData.list.length && forecast.length < 7; i++) {
      const item = forecastData.list[i];
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
  
    if (!uniqueDays.has(day)) {
      forecast.push({
        date: day,
        temp: Math.round(item.main.temp),
        condition: item.weather[0]?.main || "Unknown",
      });
      uniqueDays.add(day);
    }
  }

  return {
    city: weatherData.name,
    temp: Math.round(weatherData.main.temp),
    condition: weatherData.weather[0]?.main || "Unknown",
    alert: weatherData.alerts?.[0]?.description || "No alerts available",
    timezone: weatherData.timezone,
    forecast,
  };
  } catch (error) {
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData | { error: string }> {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!weatherRes.ok) {
      const errData = await weatherRes.json();
      return { error: errData.message || "Weather API failed. Check coordinates or API key." };
    }

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!forecastRes.ok) {
      const errData = await forecastRes.json();
      return { error: errData.message || "Forecast API failed. Check coordinates or API key." };
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();
    const forecast = [];
    const uniqueDays = new Set();

    for (let i = 0; i < forecastData.list.length && forecast.length < 7; i++) {
      const item = forecastData.list[i];
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
  
    if (!uniqueDays.has(day)) {
      forecast.push({
        date: day,
        temp: Math.round(item.main.temp),
        condition: item.weather[0]?.main || "Unknown",
      });
      uniqueDays.add(day);
    }
  }

  return {
    city: weatherData.name,
    temp: Math.round(weatherData.main.temp),
    condition: weatherData.weather[0]?.main || "Unknown",
    alert: weatherData.alerts?.[0]?.description || "No alerts available",
    timezone: weatherData.timezone,
    forecast, // Could be 3, 5, or 7 days - all real data
  };
  } catch (error) {
    // console.error("Weather fetch error:", error);
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function fetchCityByIP(): Promise<string | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!res.ok) throw new Error("IP API failed");
    const data = await res.json();
    return data.city || null;
  } catch (error) {
    return null;
  }
}

export async function TopHeadlistfetchNews(source: string = ""): Promise<NewsData[] | { error: string }> {
  const sources = source.trim() !== "" ? source : 'bbc-news,cnn,reuters,associated-press,the-verge';
  try {
    const url = `https://newsapi.org/v2/top-headlines?sources=${sources}&apiKey=${process.env.NEWSAPI_KEY}`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || `News API failed with status ${res.status}` };
    }
    
    const data = await res.json();
    const articles = data.articles
      .filter((article: any) => article.title && article.description && article.url && article.content && article.url && article.source.name)
      .map((article: any) => ({
        id:generateIdFromUrl(article.url),
        title: article.title,
        description: article.description,
        content:article.content,
        url: article.url,
        source: article.source.name,
        sourceId: article.source.id, 
        imageUrl:article.urlToImage,
        publishedAt: article.publishedAt
      }));
    return articles.length >= 2 ? articles : { error: "Insufficient valid news articles available." };
  } catch (error) {
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function AllfetchNews(
  keyword: string = "",
  options: {
    language?: string;
    sortBy?: string;
    pageSize?: number;
    country?: string; // Add country parameter
  } = {}
): Promise<NewsData[] | { error: string }> {
  try {
    const { language = "en", sortBy = "publishedAt", pageSize = 20, country = "" } = options;
    let url: string;
    const baseParams = `language=${language}&pageSize=${pageSize}&apiKey=${process.env.NEWSAPI_KEY}`;
    const countryParam = country ? `&country=${country}` : '';
    
    if (keyword.trim() !== "") {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&sortBy=${sortBy}&${baseParams}${countryParam}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?${baseParams}${countryParam}`;
    }
    const res = await fetch(url, { cache: "no-store" }); 
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || `News API failed with status ${res.status}` };
    }
    const data = await res.json(); 
    const articles = data.articles
      .filter((article: any) => article.title && article.description && article.url && article.content && article.url && article.source.name)
      .map((article: any) => ({
        id:generateIdFromUrl(article.url),
        title: article.title,
        description: article.description,
        content:article.content,
        url: article.url,
        source: article.source.name,
        sourceId: article.source.id, 
        imageUrl:article.urlToImage,
        publishedAt: article.publishedAt
      }));  
    return articles.length >= 2 ? articles : { error: "Insufficient valid news articles available." };
  } catch (error) {
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function searchNews(
  keyword: string,
  options: {
    language?: string;
    sortBy?: string;
    pageSize?: number;
    country?: string;
  } = {}
): Promise<NewsData[] | { error: string }> {
  try {
    const { language = "en", sortBy = "publishedAt", pageSize = 20, country = "" } = options;
    
    if (!process.env.NEWSAPI_KEY) {
      return { error: "API key not configured" };
    }

    const baseParams = `language=${language}&pageSize=${pageSize}&apiKey=${process.env.NEWSAPI_KEY}`;
    const countryParam = country ? `&country=${country}` : '';
    
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&sortBy=${sortBy}&${baseParams}${countryParam}`;
    
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || `News API failed with status ${res.status}` };
    }
    
    const data = await res.json();
    
    const articles = data.articles
      .filter((article: any) => article.title && article.description && article.url && article.source.name)
      .map((article: any) => ({
        id: generateIdFromUrl(article.url),
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        source: article.source.name,
        sourceId: article.source.id, 
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt
      }));
    
    return articles.length >= 1 ? articles : { error: "No articles found" };
    
  } catch (error) {
    return { error: "Network error or API unavailable" };
  }
}