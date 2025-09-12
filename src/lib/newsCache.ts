// newsCache.ts
import { NewsData } from './DataContext';

const articleCache = new Map<string, NewsData>();
const queryCache = new Map<string, { articleIds: string[]; timestamp: number }>();

const MAX_ARTICLE_CACHE_SIZE = 500;
const MAX_QUERY_CACHE_SIZE = 50;

// Cache an individual article
export function cacheArticle(article: NewsData) {
  if (articleCache.size >= MAX_ARTICLE_CACHE_SIZE) {
    const firstKey = articleCache.keys().next().value;
    if (firstKey) {
      articleCache.delete(firstKey);
    }
  }
  articleCache.set(article.id, article);
}

// Get an article by ID
export function getArticleFromCache(id: string): NewsData | null {
  return articleCache.get(id) || null;
}

// Cache multiple articles and their relationship to a query
export function cacheArticleResults(query: string, results: NewsData[]) {
  results.forEach(article => {
    cacheArticle(article);
  });
  
  if (queryCache.size >= MAX_QUERY_CACHE_SIZE) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) {
      queryCache.delete(firstKey);
    }
  }
  
  queryCache.set(query.toLowerCase(), {
    articleIds: results.map(article => article.id),
    timestamp: Date.now()
  });
}

// Get cached results for a query
export function getCachedArticleResults(query: string): NewsData[] | null {
  const cached = queryCache.get(query.toLowerCase());
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > 600000) {
    queryCache.delete(query.toLowerCase());
    return null;
  }
  
  const articles: NewsData[] = [];
  for (const id of cached.articleIds) {
    const article = getArticleFromCache(id);
    if (article) articles.push(article);
  }
  return articles.length > 0 ? articles : null;
}

// Get all articles from cache (for debugging or admin purposes)
export function getAllCachedArticles(): NewsData[] {
  return Array.from(articleCache.values());
}

// Clear specific caches
export function clearArticleCache() {
  articleCache.clear();
}

export function clearQueryCache() {
  queryCache.clear();
}

// Clear all caches
export function clearAllCaches() {
  clearArticleCache();
  clearQueryCache();
}

// Get cache statistics (for monitoring)
export function getCacheStats() {
  return {
    articleCount: articleCache.size,
    queryCount: queryCache.size,
    articleIds: Array.from(articleCache.keys()),
    queries: Array.from(queryCache.keys())
  };
}