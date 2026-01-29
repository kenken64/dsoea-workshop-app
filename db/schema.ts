import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const chapters = sqliteTable("chapters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chapterId: integer("chapter_id")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  content: text("content").notNull(),
  videoUrl: text("video_url"),
  downloadOnly: integer("download_only", { mode: "boolean" }).notNull().default(false),
  aiSummary: text("ai_summary"),
  submission: text("submission"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const chaptersRelations = relations(chapters, ({ many }) => ({
  pages: many(pages),
}));

export const pagesRelations = relations(pages, ({ one }) => ({
  chapter: one(chapters, {
    fields: [pages.chapterId],
    references: [chapters.id],
  }),
}));

export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
