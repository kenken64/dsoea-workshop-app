import { notFound } from "next/navigation";
import Link from "next/link";
import { db, chapters, pages } from "@/db";
import { eq, and, asc } from "drizzle-orm";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PageNavigation } from "@/components/page-navigation";
import { WorkshopTabs } from "@/components/workshop-tabs";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{
    chapterSlug: string;
    pageSlug: string;
  }>;
}

async function getPageData(chapterSlug: string, pageSlug: string) {
  try {
    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.slug, chapterSlug),
    });

    if (!chapter) {
      return null;
    }

    const page = await db.query.pages.findFirst({
      where: and(eq(pages.chapterId, chapter.id), eq(pages.slug, pageSlug)),
    });

    if (!page) {
      return null;
    }

    const allChapters = await db.query.chapters.findMany({
      orderBy: [asc(chapters.order)],
      with: {
        pages: {
          orderBy: [asc(pages.order)],
        },
      },
    });

    const flatPages: { chapterSlug: string; pageSlug: string; title: string }[] =
      [];
    for (const ch of allChapters) {
      for (const p of ch.pages) {
        flatPages.push({
          chapterSlug: ch.slug,
          pageSlug: p.slug,
          title: p.title,
        });
      }
    }

    const currentIndex = flatPages.findIndex(
      (p) => p.chapterSlug === chapterSlug && p.pageSlug === pageSlug
    );

    const prev =
      currentIndex > 0
        ? {
            title: flatPages[currentIndex - 1].title,
            href: `/${flatPages[currentIndex - 1].chapterSlug}/${flatPages[currentIndex - 1].pageSlug}`,
          }
        : null;

    const next =
      currentIndex < flatPages.length - 1
        ? {
            title: flatPages[currentIndex + 1].title,
            href: `/${flatPages[currentIndex + 1].chapterSlug}/${flatPages[currentIndex + 1].pageSlug}`,
          }
        : null;

    return {
      chapter,
      page,
      prev,
      next,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { chapterSlug, pageSlug } = await params;
  const data = await getPageData(chapterSlug, pageSlug);

  if (!data) {
    return { title: "Page Not Found" };
  }

  return {
    title: `${data.page.title} | ${data.chapter.title} | S-DOEA`,
    description: `${data.page.title} in ${data.chapter.title}`,
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { chapterSlug, pageSlug } = await params;
  const data = await getPageData(chapterSlug, pageSlug);

  if (!data) {
    notFound();
  }

  const { chapter, page, prev, next } = data;
  const isWorkshop = page.title.toLowerCase().includes("workshop");

  return (
    <article className="flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${chapter.slug}`} className="hover:text-foreground transition-colors">
          {chapter.title}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{page.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {chapter.title}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
      </div>

      {/* Content - Full Height */}
      <div className="flex-1 flex flex-col">
        {isWorkshop ? (
          <WorkshopTabs
            videoUrl={page.videoUrl || undefined}
            workshopTitle={page.title}
            pageId={page.id}
            tutorialRawContent={page.content.trim() || undefined}
            tutorialContent={
              page.content.trim() ? (
                <MarkdownRenderer content={page.content} />
              ) : undefined
            }
            submissionContent={
              page.submission ? (
                <MarkdownRenderer content={page.submission} />
              ) : undefined
            }
            downloadOnly={page.downloadOnly || false}
          />
        ) : (
          <div className="rounded-xl border bg-card p-6 flex-1">
            <MarkdownRenderer content={page.content} />
          </div>
        )}
      </div>

      <PageNavigation prev={prev} next={next} />
    </article>
  );
}
