// utils/contentCleaner.ts
export function cleanNewsContent(content: string | undefined): string {
  if (!content) return '';
  
  // Remove character count indicators: [+2968 chars]
  let cleaned = content.replace(/\[\+\d+\s*chars\]/gi, '');
  
  // Remove empty HTML tags (like <ul><li></li><li></li></ul>)
  cleaned = cleaned.replace(/<[^>]*><\/[^>]*>/g, '');
  cleaned = cleaned.replace(/<[^>]*>\s*<\/[^>]*>/g, '');
  
  // Remove any remaining HTML tags if you want plain text
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// Alternative: Keep HTML but clean it up
export function cleanNewsHTML(content: string | undefined): string {
  if (!content) return '';
  
  // Remove character count indicators
  let cleaned = content.replace(/\[\+\d+\s*chars\]/gi, '');
  
  // Remove empty lists and list items
  cleaned = cleaned.replace(/<ul>\s*<li>\s*<\/li>\s*<\/ul>/gi, '');
  cleaned = cleaned.replace(/<ul><li><\/li><\/ul>/gi, '');
  
  return cleaned;
}