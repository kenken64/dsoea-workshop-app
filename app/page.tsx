import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, GitBranch, Container, Settings, TestTube, Gauge } from "lucide-react";
import { db, chapters, pages } from "@/db";
import { asc } from "drizzle-orm";

async function getChapters() {
  try {
    const allChapters = await db.query.chapters.findMany({
      orderBy: [asc(chapters.order)],
      with: {
        pages: {
          orderBy: [asc(pages.order)],
        },
      },
    });
    return allChapters;
  } catch (error) {
    return [];
  }
}

const coreAreas = [
  {
    icon: Settings,
    title: "Build & Deploy",
    description: "Configuration management, CI/CD pipelines, Infrastructure as Code, and container management",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Shield,
    title: "Security Integration",
    description: "SAST, DAST, Software Composition Analysis, vulnerability assessment, and secure coding practices",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: GitBranch,
    title: "Governance & Measurement",
    description: "Compliance as Code, business metrics, dashboards, and the DevSecOps Maturity Model",
    color: "text-purple-600 bg-purple-100",
  },
];

const chapterIcons: Record<string, typeof Shield> = {
  "01-source-control-management": GitBranch,
  "02-containerization": Container,
  "03-infrastructure-as-code": Settings,
  "04-github-actions-cicd": Shield,
  "05-unit-testing": TestTube,
  "06-load-testing": Gauge,
};

export default async function HomePage() {
  const allChapters = await getChapters();

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 py-4">
        <div className="mb-6">
          <Image
            src="/images/nus-iss-logo.png"
            alt="NUS ISS Logo"
            width={280}
            height={80}
            className="h-auto"
            priority
          />
        </div>
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          DevSecOps Curriculum
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          DevSecOps Engineering and Automation
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          This curriculum covers three core areas with a focus on embedding security
          throughout the entire software lifecycle rather than treating it as an afterthought.
        </p>
      </section>

      {/* Core Areas */}
      <section className="grid gap-4 sm:grid-cols-3">
        {coreAreas.map((area) => (
          <div
            key={area.title}
            className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2.5 rounded-lg ${area.color}`}>
              <area.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{area.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {area.description}
            </p>
          </div>
        ))}
      </section>

      {/* Workshops List */}
      {allChapters.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Workshops</h2>
            <span className="text-sm text-muted-foreground">
              {allChapters.reduce((acc, ch) => acc + ch.pages.length, 0)} total workshops
            </span>
          </div>
          <div className="grid gap-4">
            {allChapters.map((chapter) => {
              const Icon = chapterIcons[chapter.slug] || GitBranch;
              return (
                <div
                  key={chapter.slug}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:border-primary/50"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {chapter.title}
                          </h3>
                          {chapter.description && (
                            <p className="text-muted-foreground mt-1 text-sm">
                              {chapter.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Workshop links */}
                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                      {chapter.pages.map((page) => (
                        <Link
                          key={page.slug}
                          href={`/${chapter.slug}/${page.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {page.title}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
