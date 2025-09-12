export function generateIdFromUrl(url: string): string {
  // Ensure the URL is normalized
  const normalizedUrl = url.trim().toLowerCase();
  
  let hash = 0;
  for (let i = 0; i < normalizedUrl.length; i++) {
    const char = normalizedUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = Math.abs(hash & hash); // Ensure positive number
  }
  return hash.toString(36).substring(0, 8);
}