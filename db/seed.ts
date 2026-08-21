import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { getAllContent } from "../lib/content";

const { chapters, pages } = schema;

async function seed() {
  console.log("Starting database seed...");

  const databaseUrl = process.env.DATABASE_URL || "file:workshop.db";
  console.log(`Using database: ${databaseUrl}`);

  const client = createClient({
    url: databaseUrl,
  });

  const db = drizzle(client, { schema });

  // Create tables if they don't exist
  console.log("Creating tables if not exist...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      video_url TEXT,
      download_only INTEGER NOT NULL DEFAULT 0,
      ai_summary TEXT,
      submission TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  console.log("Tables ready");

  // Get all content from markdown files
  const allContent = getAllContent();

  if (allContent.length === 0) {
    console.log("No content found in content directory");
    return;
  }

  console.log(`Found ${allContent.length} chapters`);

  const validChapterSlugs: string[] = [];
  const validPageIds: number[] = [];

  for (const chapter of allContent) {
    console.log(`Processing chapter: ${chapter.meta.title}`);

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
      console.log(`  Updated chapter: ${chapter.meta.title}`);
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
      console.log(`  Created chapter: ${chapter.meta.title}`);
    }

    validChapterSlugs.push(chapter.slug);

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
            videoUrl: page.meta.videoUrl || null,
            downloadOnly: page.meta.downloadOnly || false,
            submission: page.meta.submission || null,
            order: page.meta.order,
            updatedAt: new Date(),
          })
          .where(eq(pages.id, existingPage.id));
        console.log(`    Updated page: ${page.meta.title}`);
        validPageIds.push(existingPage.id);
      } else {
        // Insert new page
        const result = await db
          .insert(pages)
          .values({
            chapterId,
            title: page.meta.title,
            slug: page.slug,
            content: page.content,
            videoUrl: page.meta.videoUrl || null,
            downloadOnly: page.meta.downloadOnly || false,
            submission: page.meta.submission || null,
            order: page.meta.order,
          })
          .returning();
        console.log(`    Created page: ${page.meta.title}`);
        validPageIds.push(result[0].id);
      }
    }
  }

  // Remove pages and chapters that no longer have a backing markdown file
  const stalePages = await db.select().from(pages);
  const pagesToDelete = stalePages.filter((p) => !validPageIds.includes(p.id));
  for (const page of pagesToDelete) {
    await db.delete(pages).where(eq(pages.id, page.id));
    console.log(`  Removed stale page: ${page.title} (slug: ${page.slug})`);
  }

  const staleChapters = await db.select().from(chapters);
  const chaptersToDelete = staleChapters.filter(
    (c) => !validChapterSlugs.includes(c.slug)
  );
  for (const chapter of chaptersToDelete) {
    await db.delete(chapters).where(eq(chapters.id, chapter.id));
    console.log(`  Removed stale chapter: ${chapter.title} (slug: ${chapter.slug})`);
  }

  console.log("Seed completed!");
}

seed().catch(console.error);
