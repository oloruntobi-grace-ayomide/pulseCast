import { NextRequest, NextResponse } from 'next/server';
import { getArticleFromCache, cacheArticle, getCachedArticleResults } from '@/lib/newsCache';
import { TopHeadlistfetchNews, AllfetchNews } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const fromSearch = searchParams.get('fromSearch');
    const query = searchParams.get('q');
    
  // If coming from search, try to find in search cache first
    if (fromSearch && query) {
      const searchResults = getCachedArticleResults(query);
      const article = searchResults?.find(item => item.id === id);
      if (article) return NextResponse.json(article);
    }
    
    const cachedArticle = getArticleFromCache(id);
    if (cachedArticle) {
      return NextResponse.json(cachedArticle);
    }

    let article = null;
    
    const topHeadlines = await TopHeadlistfetchNews();  
    if (!('error' in topHeadlines)) {
      article = topHeadlines.find(item => item.id === id);
    }
    
    if (!article) {
      const allNews = await AllfetchNews('', { pageSize: 100 }); // Increased size for better coverage
      if (!('error' in allNews)) {
        article = allNews.find(item => item.id === id);
      }
    }
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' }, 
        { status: 404 }
      );
    }
    
    cacheArticle(article);
    return NextResponse.json(article);  
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}