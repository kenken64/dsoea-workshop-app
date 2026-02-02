"use client";

import { useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video, BookOpen, Upload, MessageSquare } from "lucide-react";
import { YouTubePlayer } from "@/components/youtube-player";
import { AIDebrief } from "@/components/ai-debrief";
import { PDFExportButton } from "@/components/pdf-export-button";

interface WorkshopTabsProps {
  videoUrl?: string;
  videoContent?: React.ReactNode;
  tutorialContent?: React.ReactNode;
  tutorialRawContent?: string;
  workshopTitle?: string;
  pageId?: number;
  submissionContent?: React.ReactNode;
  debriefContent?: React.ReactNode;
  downloadOnly?: boolean;
}

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function WorkshopTabs({
  videoUrl,
  videoContent,
  tutorialContent,
  tutorialRawContent,
  workshopTitle,
  pageId,
  submissionContent,
  debriefContent,
  downloadOnly = false,
}: WorkshopTabsProps) {
  const videoId = videoUrl ? extractVideoId(videoUrl) : null;
  const showAIDebrief = !downloadOnly && tutorialRawContent && workshopTitle && pageId;
  const tutorialRef = useRef<HTMLDivElement>(null);
  const sanitizedTitle = workshopTitle?.replace(/[^a-zA-Z0-9-_]/g, "-") || "tutorial";
  return (
    <Tabs defaultValue="video" className="flex-1 flex flex-col">
      <TabsList className={`grid w-full ${showAIDebrief ? 'grid-cols-4' : 'grid-cols-3'} h-auto p-1 bg-muted/50 rounded-xl shrink-0`}>
        <TabsTrigger
          value="video"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-lg py-2 sm:py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <Video className="h-4 w-4" />
          <span className="font-medium">Video</span>
        </TabsTrigger>
        <TabsTrigger
          value="tutorial"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-lg py-2 sm:py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <BookOpen className="h-4 w-4" />
          <span className="font-medium">Tutorial</span>
        </TabsTrigger>
        <TabsTrigger
          value="submission"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-lg py-2 sm:py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <Upload className="h-4 w-4" />
          <span className="font-medium">Submission</span>
        </TabsTrigger>
        {showAIDebrief && (
          <TabsTrigger
            value="debrief"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-lg py-2 sm:py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium hidden sm:inline">AI Debrief</span>
            <span className="font-medium sm:hidden">AI</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="video" className="mt-4 sm:mt-6 flex-1">
        <div className="rounded-xl border bg-card overflow-hidden h-full min-h-[400px] sm:min-h-[500px]">
          {videoId ? (
            <YouTubePlayer videoId={videoId} />
          ) : videoContent ? (
            videoContent
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 sm:py-16 px-4 sm:px-6">
              <div className="p-3 sm:p-4 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Video className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">Video Content</h3>
              <p className="text-muted-foreground text-center text-sm max-w-md">
                Video content for this workshop will be available soon.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="tutorial" className="mt-4 sm:mt-6 flex-1">
        <div className="rounded-xl border bg-card overflow-hidden h-full min-h-[400px] sm:min-h-[500px]">
          {tutorialContent ? (
            <div className="p-4 sm:p-6">
              <div className="flex justify-end mb-4">
                <PDFExportButton
                  contentRef={tutorialRef}
                  filename={`${sanitizedTitle}-tutorial`}
                  title="Export Tutorial as PDF"
                />
              </div>
              <div ref={tutorialRef}>{tutorialContent}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 sm:py-16 px-4 sm:px-6">
              <div className="p-3 sm:p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">Tutorial Content</h3>
              <p className="text-muted-foreground text-center text-sm max-w-md">
                Step-by-step tutorial for this workshop will be available soon.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="submission" className="mt-4 sm:mt-6 flex-1">
        <div className="rounded-xl border bg-card overflow-hidden h-full min-h-[400px] sm:min-h-[500px]">
          {submissionContent || (
            <div className="flex flex-col items-center justify-center h-full py-12 sm:py-16 px-4 sm:px-6">
              <div className="p-3 sm:p-4 rounded-full bg-orange-100 text-orange-600 mb-4">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">Submission</h3>
              <p className="text-muted-foreground text-center text-sm max-w-md">
                Assignment submission details for this workshop will be available soon.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {showAIDebrief && (
        <TabsContent value="debrief" className="mt-4 sm:mt-6 flex-1">
          <div className="rounded-xl border bg-card overflow-hidden h-full min-h-[400px] sm:min-h-[500px]">
            {tutorialRawContent && workshopTitle && pageId ? (
              <AIDebrief content={tutorialRawContent} title={workshopTitle} pageId={pageId} />
            ) : debriefContent ? (
              debriefContent
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 sm:py-16 px-4 sm:px-6">
                <div className="p-3 sm:p-4 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">AI Debrief</h3>
                <p className="text-muted-foreground text-center text-sm max-w-md">
                  AI-powered workshop debrief requires tutorial content.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
