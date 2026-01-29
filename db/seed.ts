import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
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

  // Run migrations first
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed");
  } catch (error) {
    console.log("No migrations to run or migrations folder not found");
  }

  // Get all content from markdown files
  const allContent = getAllContent();

  if (allContent.length === 0) {
    console.log("No content found in content directory");
    return;
  }

  console.log(`Found ${allContent.length} chapters`);

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
      } else {
        // Insert new page
        await db.insert(pages).values({
          chapterId,
          title: page.meta.title,
          slug: page.slug,
          content: page.content,
          videoUrl: page.meta.videoUrl || null,
          downloadOnly: page.meta.downloadOnly || false,
          submission: page.meta.submission || null,
          order: page.meta.order,
        });
        console.log(`    Created page: ${page.meta.title}`);
      }
    }
  }

  console.log("Seed completed!");
}

seed().catch(console.error);
