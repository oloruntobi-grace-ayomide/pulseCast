// app/api/news/headlines/route.ts
import { NextResponse } from 'next/server';
import { TopHeadlistfetchNews } from '@/lib/api';
import { getCachedArticleResults, cacheArticleResults } from '@/lib/newsCache';

export async function GET() {
  try {
    const cacheKey = 'headlines';
    
    const cachedResults = getCachedArticleResults(cacheKey);
    if (cachedResults) {
      return NextResponse.json(cachedResults);
    }

    const news = await TopHeadlistfetchNews();
    
    if (!("error" in news)) {
      cacheArticleResults(cacheKey, news);
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Headlines fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch headlines' },
      { status: 500 }
    );
  }
}