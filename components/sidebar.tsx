"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Page {
  id: number;
  title: string;
  slug: string;
  order: number;
}

interface Chapter {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  pages: Page[];
}

interface SidebarProps {
  chapters: Chapter[];
}

export function Sidebar({ chapters }: SidebarProps) {
  const pathname = usePathname();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(chapters.map((c) => c.slug))
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle responsive collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleChapter = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const isActivePage = (chapterSlug: string, pageSlug?: string) => {
    if (pageSlug) {
      return pathname === `/${chapterSlug}/${pageSlug}`;
    }
    return pathname === `/${chapterSlug}`;
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && (
            <Link href="/" className="font-bold text-lg hover:text-primary transition-colors">
              S-DOEA
            </Link>
          )}
        </div>
        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className={cn("space-y-2", collapsed ? "px-2" : "px-3")}>
          {chapters.map((chapter) => (
            <div key={chapter.slug} className="space-y-1">
              {collapsed ? (
                // Collapsed view - just icons/initials
                <div className="relative group">
                  <Link
                    href={`/${chapter.slug}`}
                    className={cn(
                      "flex items-center justify-center rounded-lg p-2 text-sm font-semibold transition-all",
                      "hover:bg-primary/10 hover:text-primary",
                      isActivePage(chapter.slug) && "bg-primary/10 text-primary"
                    )}
                    title={chapter.title}
                  >
                    <span className="text-xs font-bold">
                      {chapter.title.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </span>
                  </Link>
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover border rounded-md shadow-md text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {chapter.title}
                  </div>
                </div>
              ) : (
                // Expanded view
                <>
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer",
                      "hover:bg-primary/10 hover:text-primary",
                      isActivePage(chapter.slug) && "bg-primary/10 text-primary"
                    )}
                  >
                    <Link href={`/${chapter.slug}`} className="flex-1 truncate">
                      {chapter.title}
                    </Link>
                    {chapter.pages.length > 0 && (
                      <button
                        onClick={(e) => toggleChapter(chapter.slug, e)}
                        className="p-1 rounded hover:bg-primary/20 transition-colors shrink-0"
                      >
                        {expandedChapters.has(chapter.slug) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {expandedChapters.has(chapter.slug) && chapter.pages.length > 0 && (
                    <div className="ml-3 space-y-1 border-l-2 border-primary/20 pl-3">
                      {chapter.pages.map((page) => (
                        <Link
                          key={page.slug}
                          href={`/${chapter.slug}/${page.slug}`}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-all truncate",
                            "hover:bg-accent hover:text-foreground",
                            isActivePage(chapter.slug, page.slug)
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {page.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t p-4 text-xs text-muted-foreground">
          <p>DevSecOps Engineering</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle button - fixed position */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden shadow-md bg-background"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>


      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          // Mobile
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop
          "md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-72",
          // Mobile always full width when open
          "w-72"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for main content */}
      <div
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300",
          collapsed ? "w-16" : "w-72"
        )}
      />
    </>
  );
}
