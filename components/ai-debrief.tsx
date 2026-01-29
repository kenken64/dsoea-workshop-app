"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, RefreshCw, Database } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface AIDebriefProps {
  content: string;
  title: string;
  pageId: number;
}

export function AIDebrief({ content, title, pageId }: AIDebriefProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check for cached summary on mount
  useEffect(() => {
    const checkCached = async () => {
      try {
        const response = await fetch("/api/ai-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pageId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.cached && data.summary) {
            setSummary(data.summary);
            setIsCached(true);
          }
        }
      } catch (err) {
        // Ignore errors, user can generate manually
      } finally {
        setInitialLoading(false);
      }
    };

    checkCached();
  }, [pageId]);

  const generateSummary = async (forceRegenerate = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, title, pageId, forceRegenerate }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setIsCached(data.cached);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm mt-2">Checking for cached summary...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6">
        <div className="p-4 rounded-full bg-purple-100 text-purple-600 mb-4 animate-pulse">
          <Sparkles className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Generating AI Summary</h3>
        <p className="text-muted-foreground text-center text-sm max-w-md mb-4">
          Analyzing the workshop content and creating a personalized summary...
        </p>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6">
        <div className="p-4 rounded-full bg-red-100 text-red-600 mb-4">
          <Sparkles className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Error Generating Summary</h3>
        <p className="text-muted-foreground text-center text-sm max-w-md mb-4">
          {error}
        </p>
        <button
          onClick={() => generateSummary(false)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (summary) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-lg">AI-Generated Summary</h3>
            {isCached && (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <Database className="h-3 w-3" />
                Cached
              </span>
            )}
          </div>
          <button
            onClick={() => generateSummary(true)}
            className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
        </div>
        <MarkdownRenderer content={summary} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6">
      <div className="p-4 rounded-full bg-purple-100 text-purple-600 mb-4">
        <Sparkles className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold mb-2">AI Debrief</h3>
      <p className="text-muted-foreground text-center text-sm max-w-md mb-6">
        Get an AI-generated summary and explanation of this workshop's key concepts,
        learning objectives, and tips for success.
      </p>
      <button
        onClick={() => generateSummary(false)}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
      >
        <Sparkles className="h-5 w-5" />
        Generate AI Summary
      </button>
    </div>
  );
}
