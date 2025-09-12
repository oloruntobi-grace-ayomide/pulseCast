"use client";
import { useEffect, useRef } from "react";
import { useData } from "@/lib/DataContext";
import { fetchCityByIP } from "@/lib/api";

export default function GeolocationHandler() {
  const { updateWeather, updateWeatherByCoords } = useData();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentCityRef = useRef<string | null>(null);

  const startWeatherPolling = (city: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    currentCityRef.current = city;
    intervalRef.current = setInterval(async () => {
      console.log(`Polling weather for ${city} at ${new Date().toISOString()}`);
      await updateWeather(city);
    }, 600000); // 10 minutes
  };

  const getLocation = async () => {
    const storedCity = localStorage.getItem("lastCity");
    if (storedCity) {
      console.log(`Using stored city: ${storedCity}`);
      await updateWeather(storedCity);
      startWeatherPolling(storedCity);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Geolocation success: lat=${latitude}, lon=${longitude}`);
          const result = await updateWeatherByCoords(latitude, longitude);
          if (!("error" in result) && result.city) {
            console.log(`Storing city: ${result.city}`);
            localStorage.setItem("lastCity", result.city);
            startWeatherPolling(result.city);
          }
        },
        async (error) => {
          console.error("Geolocation error:", error);
          const city = await fetchCityByIP();
          if (city) {
            console.log(`IP-based city: ${city}`);
            const result = await updateWeather(city);
            if (!("error" in result) && result.city) {
              localStorage.setItem("lastCity", result.city);
              startWeatherPolling(result.city);
            }
          } else {
            console.error("Failed to fetch city by IP");
          }
        },
        {
          timeout: 10000, // 10 second timeout
          enableHighAccuracy: false // Don't require high accuracy
        }
      );
    } else {
      console.error("Geolocation not supported");
      const city = await fetchCityByIP();
      if (city) {
        console.log(`IP-based city: ${city}`);
        const result = await updateWeather(city);
        if (!("error" in result) && result.city) {
          localStorage.setItem("lastCity", result.city);
          startWeatherPolling(result.city);
        }
      } else {
        console.error("Failed to fetch city by IP");
      }
    }
  };

  useEffect(() => {
    const handleResetPolling = (event: CustomEvent) => {
      startWeatherPolling(event.detail.city);
    };

    window.addEventListener("resetWeatherPolling", handleResetPolling as EventListener);
    getLocation();

    return () => {
      console.log("Cleaning up GeolocationHandler interval and event listener");
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("resetWeatherPolling", handleResetPolling as EventListener);
    };
  }, [updateWeather, updateWeatherByCoords]);

  return null;
}