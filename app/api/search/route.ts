import { NextRequest, NextResponse } from "next/server";
import { db, pages, chapters } from "@/db";
import { like, or, asc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    // Search pages by title and content
    const results = await db
      .select({
        id: pages.id,
        title: pages.title,
        slug: pages.slug,
        content: pages.content,
        chapterId: pages.chapterId,
        chapterSlug: chapters.slug,
        chapterTitle: chapters.title,
      })
      .from(pages)
      .innerJoin(chapters, eq(pages.chapterId, chapters.id))
      .where(or(like(pages.title, searchTerm), like(pages.content, searchTerm)))
      .orderBy(asc(chapters.order), asc(pages.order))
      .limit(10);

    // Create excerpts from content
    const formattedResults = results.map((result) => {
      let excerpt = "";

      // Find the position of the search term in content
      const lowerContent = result.content.toLowerCase();
      const position = lowerContent.indexOf(query.toLowerCase());

      if (position !== -1) {
        // Extract surrounding text
        const start = Math.max(0, position - 50);
        const end = Math.min(
          result.content.length,
          position + query.length + 100
        );
        excerpt =
          (start > 0 ? "..." : "") +
          result.content.slice(start, end).trim() +
          (end < result.content.length ? "..." : "");
      } else {
        // Use the beginning of the content
        excerpt = result.content.slice(0, 150).trim() + "...";
      }

      return {
        id: result.id,
        title: result.title,
        slug: result.slug,
        chapterSlug: result.chapterSlug,
        chapterTitle: result.chapterTitle,
        excerpt,
      };
    });

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}
