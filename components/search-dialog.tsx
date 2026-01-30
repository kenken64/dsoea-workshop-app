"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  chapterSlug: string;
  chapterTitle: string;
  excerpt: string;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigateToResult(results[selectedIndex]);
      }
    },
    [results, selectedIndex]
  );

  const navigateToResult = (result: SearchResult) => {
    router.push(`/${result.chapterSlug}/${result.slug}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-30 flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
          Ctrl+K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl w-[calc(100vw-2rem)] sm:w-full p-0 gap-0 top-[10%] translate-y-0 sm:top-[50%] sm:-translate-y-1/2">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="sr-only">Search</DialogTitle>
          </DialogHeader>

          <div className="flex items-center border-b px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search workshops..."
              className="flex-1 min-w-0 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              autoFocus
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin ml-2 shrink-0" />}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query && (
              <p className="text-center text-sm text-muted-foreground py-8">
                Start typing to search...
              </p>
            )}

            {query && !loading && results.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No results found for &quot;{query}&quot;
              </p>
            )}

            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => navigateToResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-start gap-3 rounded-lg p-3 text-left transition-colors",
                  index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                )}
              >
                <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{result.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {result.chapterTitle}
                  </div>
                  {result.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {result.excerpt}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {results.length > 0 && (
            <div className="border-t px-4 py-2 text-xs text-muted-foreground flex flex-wrap gap-4">
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">
                  ↑↓
                </kbd>{" "}
                navigate
              </span>
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">
                  Enter
                </kbd>{" "}
                select
              </span>
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">
                  Esc
                </kbd>{" "}
                close
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
