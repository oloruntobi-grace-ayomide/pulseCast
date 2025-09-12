export function formatTimeForTimezone(timezoneOffset: number): {
  day: string;
  date: string;
  time: string;
} {
  // Get current UTC time
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // Convert to city's timezone (timezoneOffset is in seconds, convert to ms)
  const cityTime = new Date(utc + (timezoneOffset * 1000));
  
  // Format the date and time
  const day = cityTime.toLocaleDateString("en-US", { weekday: "long" });
  const date = cityTime.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });
  const time = cityTime.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });
  
  return { day, date, time };
}