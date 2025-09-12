import { NextRequest, NextResponse } from "next/server";
import { searchNews } from "@/lib/api";
import { getCachedArticleResults, cacheArticleResults } from "@/lib/newsCache";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("query");

  try {
    if (!searchQuery) {
      return NextResponse.json({ error: "Please enter a search query" }, { status: 400 });
    }

    const cachedResults = getCachedArticleResults(searchQuery);
    if (cachedResults) {
      return NextResponse.json(cachedResults);
    }

    const searchResults = await searchNews(searchQuery);
    
    if (!("error" in searchResults)) {
      cacheArticleResults(searchQuery, searchResults);
    }
    return NextResponse.json(searchResults);
  } catch (error) {
    return NextResponse.json({ error: "Server error while fetching news" }, { status: 500 });
  }
}