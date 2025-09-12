import { NextResponse } from 'next/server';
import { AllfetchNews } from '@/lib/api';
import { getCachedArticleResults, cacheArticleResults } from '@/lib/newsCache';

export async function GET() {
  try {
    const cacheKey = 'all-news';
    
    const cachedResults = getCachedArticleResults(cacheKey);
    if (cachedResults) {
      return NextResponse.json(cachedResults);
    }

    const news = await AllfetchNews("", {
      pageSize: 30,
    });
    
    if (!("error" in news)) {
      cacheArticleResults(cacheKey, news);
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('All news fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all news' },
      { status: 500 }
    );
  }
}