import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { getAllContent } from "../lib/content";

const { chapters, pages } = schema;

async function reset() {
  console.log("Resetting database...");

  const client = createClient({
    url: "file:workshop.db",
  });

  const db = drizzle(client, { schema });

  // Delete all existing data
  try {
    await db.delete(pages);
    await db.delete(chapters);
    console.log("Cleared existing data");
  } catch (error) {
    console.log("No existing data to clear");
  }

  // Run migrations
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed");
  } catch (error) {
    console.log("Migrations already applied");
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

    // Insert chapter
    const result = await db
      .insert(chapters)
      .values({
        title: chapter.meta.title,
        slug: chapter.slug,
        description: chapter.meta.description,
        order: chapter.meta.order,
      })
      .returning();
    const chapterId = result[0].id;
    console.log(`  Created chapter: ${chapter.meta.title}`);

    // Process pages
    for (const page of chapter.pages) {
      await db.insert(pages).values({
        chapterId,
        title: page.meta.title,
        slug: page.slug,
        content: page.content,
        videoUrl: page.meta.videoUrl || null,
        order: page.meta.order,
      });
      console.log(`    Created page: ${page.meta.title}`);
    }
  }

  console.log("Reset completed!");
}

reset().catch(console.error);
