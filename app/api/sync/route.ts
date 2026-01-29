import { NextResponse } from "next/server";
import { db, chapters, pages } from "@/db";
import { getAllContent } from "@/lib/content";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    // Get all content from markdown files
    const allContent = getAllContent();

    if (allContent.length === 0) {
      return NextResponse.json({
        message: "No content found in content directory",
        chapters: 0,
        pages: 0,
      });
    }

    let totalChapters = 0;
    let totalPages = 0;

    for (const chapter of allContent) {
      // Check if chapter exists
      const existingChapters = await db
        .select()
        .from(chapters)
        .where(eq(chapters.slug, chapter.slug));
      const existingChapter = existingChapters[0];

      let chapterId: number;

      if (existingChapter) {
        // Update existing chapter
        await db
          .update(chapters)
          .set({
            title: chapter.meta.title,
            description: chapter.meta.description,
            order: chapter.meta.order,
            updatedAt: new Date(),
          })
          .where(eq(chapters.slug, chapter.slug));
        chapterId = existingChapter.id;
      } else {
        // Insert new chapter
        const result = await db
          .insert(chapters)
          .values({
            title: chapter.meta.title,
            slug: chapter.slug,
            description: chapter.meta.description,
            order: chapter.meta.order,
          })
          .returning();
        chapterId = result[0].id;
        totalChapters++;
      }

      // Process pages
      for (const page of chapter.pages) {
        const existingPages = await db
          .select()
          .from(pages)
          .where(eq(pages.slug, page.slug));
        const existingPage = existingPages.find((p) => p.chapterId === chapterId);

        if (existingPage) {
          // Update existing page
          await db
            .update(pages)
            .set({
              title: page.meta.title,
              content: page.content,
              order: page.meta.order,
              updatedAt: new Date(),
            })
            .where(eq(pages.id, existingPage.id));
        } else {
          // Insert new page
          await db.insert(pages).values({
            chapterId,
            title: page.meta.title,
            slug: page.slug,
            content: page.content,
            order: page.meta.order,
          });
          totalPages++;
        }
      }
    }

    return NextResponse.json({
      message: "Sync completed successfully",
      chapters: totalChapters,
      pages: totalPages,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
