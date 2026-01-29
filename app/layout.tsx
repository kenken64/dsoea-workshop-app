import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github.css";
import { Sidebar } from "@/components/sidebar";
import { SearchDialog } from "@/components/search-dialog";
import { db, chapters, pages } from "@/db";
import { asc } from "drizzle-orm";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S-DOEA Workshops",
  description: "DevSecOps Engineering and Automation",
};

async function getNavigation() {
  try {
    const allChapters = await db.query.chapters.findMany({
      orderBy: [asc(chapters.order)],
      with: {
        pages: {
          orderBy: [asc(pages.order)],
        },
      },
    });
    console.log(`[Navigation] Found ${allChapters.length} chapters`);
    return allChapters;
  } catch (error) {
    console.error("[Navigation] Error fetching chapters:", error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await getNavigation();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar chapters={navigation} />
          <main className="flex-1 min-w-0">
            <SearchDialog />
            <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8 pt-16 md:pt-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
