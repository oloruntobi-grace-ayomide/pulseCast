import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { formatNewsDate } from '@/lib/dateUtils'; 
import { cleanNewsContent } from '@/lib/contentCleaner';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getNewsArticle(id: string) {
  try {
    const baseUrl = process.env.VERCEL_URL ? process.env.VERCEL_URL : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news/${id}`, {
      next: { 
        revalidate: 300,
        tags: [`news-${id}`] 
       } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { id } = await params
  const article = await getNewsArticle(id);
  if (!article) {
    notFound();
  }

  return (
    <div className="parent mt-[40px] mb-[40px]">
      <Card>
        <CardContent className="p-6">
          <h1 className="mb-4 md:text-3xl text-xl font-bold text-gray-800">{article.title}</h1>
          
          {/* Source and Date */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <span className="font-medium">{article.source}</span>
              {article.publishedAt && (
                <>
                  <span>•</span>
                  <span>{formatNewsDate(article.publishedAt)}</span>
                </>
              )}
          </div>
          
          {article.imageUrl && (
            <div className="overflow-hidden w-full mb-6 sm:rounded-[20px] rounded-[10px] bg-gray-200">
              <img
                src={article.imageUrl  || "/favicon/pulsecast.png"} 
                alt={article.title}
                className="w-full h-full object-fill"
              />
            </div>
          )}
          
          <div className="prose max-w-none">
            <p className="mb-4 md:text-lg text-lg leading-relaxed text-gray-700">{article.description}</p>
            
            {article.content ? (
              <div className="text-gray-800 whitespace-pre-line">
                {cleanNewsContent(article.content)}
              </div>
            ) : (
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 font-medium text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Read on Original Site
              </a>
            )}
          </div>
          
          <div className="flex flex-col gap-4 pt-6 mt-8 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              <p>Original source: {article.source}</p>
              {article.publishedAt && (
                <p>Published: {formatNewsDate(article.publishedAt)}</p>
              )}
            </div>
            {article.content &&
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 font-medium text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Read on Original Site
              </a>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const article = await getNewsArticle(id);  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | News`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [{ url: article.imageUrl }] : [],
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}