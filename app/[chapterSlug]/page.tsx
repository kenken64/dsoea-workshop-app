import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { db, chapters, pages } from "@/db";
import { eq, asc } from "drizzle-orm";

interface ChapterPageProps {
  params: Promise<{
    chapterSlug: string;
  }>;
}

async function getChapter(slug: string) {
  try {
    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.slug, slug),
      with: {
        pages: {
          orderBy: [asc(pages.order)],
        },
      },
    });
    return chapter;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;
  const chapter = await getChapter(chapterSlug);

  if (!chapter) {
    return { title: "Chapter Not Found" };
  }

  return {
    title: `${chapter.title} | S-DOEA Workshops`,
    description: chapter.description || `Chapter: ${chapter.title}`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;
  const chapter = await getChapter(chapterSlug);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{chapter.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {chapter.pages.length} Workshop{chapter.pages.length !== 1 ? "s" : ""}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{chapter.title}</h1>
        {chapter.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {chapter.description}
          </p>
        )}
      </div>

      {/* Workshops */}
      {chapter.pages.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Workshops</h2>
          <div className="grid gap-3">
            {chapter.pages.map((page, index) => (
              <Link
                key={page.slug}
                href={`/${chapter.slug}/${page.slug}`}
                className="group flex items-center gap-4 rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {page.title}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No workshops in this section yet.
          </p>
        </div>
      )}

      {/* Start Button */}
      {chapter.pages.length > 0 && (
        <div className="pt-4">
          <Link
            href={`/${chapter.slug}/${chapter.pages[0].slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Start with {chapter.pages[0].title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
