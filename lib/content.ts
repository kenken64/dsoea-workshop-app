import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ContentMeta {
  title: string;
  order: number;
  description?: string;
  videoUrl?: string;
  downloadOnly?: boolean;
  submission?: string;
}

export interface PageContent {
  meta: ContentMeta;
  content: string;
  slug: string;
}

export interface ChapterContent {
  meta: ContentMeta;
  slug: string;
  pages: PageContent[];
}

export function getChapterSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function getChapterContent(chapterSlug: string): ChapterContent | null {
  const chapterPath = path.join(CONTENT_DIR, chapterSlug);
  const indexPath = path.join(chapterPath, "_index.md");

  if (!fs.existsSync(chapterPath)) {
    return null;
  }

  // Read chapter metadata from _index.md
  let meta: ContentMeta = { title: chapterSlug, order: 0 };
  if (fs.existsSync(indexPath)) {
    const fileContent = fs.readFileSync(indexPath, "utf-8");
    const { data } = matter(fileContent);
    meta = {
      title: data.title || chapterSlug,
      order: data.order || 0,
      description: data.description,
    };
  }

  // Get all page files
  const pages = fs
    .readdirSync(chapterPath)
    .filter((file) => file.endsWith(".md") && file !== "_index.md")
    .map((file) => {
      const filePath = path.join(chapterPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const slug = file.replace(/\.md$/, "");

      return {
        meta: {
          title: data.title || slug,
          order: data.order || 0,
          description: data.description,
          videoUrl: data.videoUrl,
          downloadOnly: data.downloadOnly || false,
          submission: data.submission,
        },
        content,
        slug,
      };
    })
    .sort((a, b) => a.meta.order - b.meta.order);

  return {
    meta,
    slug: chapterSlug,
    pages,
  };
}

export function getAllContent(): ChapterContent[] {
  const chapterSlugs = getChapterSlugs();
  return chapterSlugs
    .map((slug) => getChapterContent(slug))
    .filter((chapter): chapter is ChapterContent => chapter !== null)
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function getPageContent(
  chapterSlug: string,
  pageSlug: string
): PageContent | null {
  const pagePath = path.join(CONTENT_DIR, chapterSlug, `${pageSlug}.md`);

  if (!fs.existsSync(pagePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(pagePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      title: data.title || pageSlug,
      order: data.order || 0,
      description: data.description,
      videoUrl: data.videoUrl,
      downloadOnly: data.downloadOnly || false,
      submission: data.submission,
    },
    content,
    slug: pageSlug,
  };
}
