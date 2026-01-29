"use client";

import { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [savedTime, setSavedTime] = useState<number | null>(null);
  const storageKey = `youtube-progress-${videoId}`;

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const time = parseFloat(saved);
      setSavedTime(time);
    }
  }, [storageKey]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const initPlayer = () => {
    if (!containerRef.current) return;

    const savedProgress = localStorage.getItem(storageKey);
    const startTime = savedProgress ? parseFloat(savedProgress) : 0;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        start: Math.floor(startTime),
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          setIsReady(true);
        },
        onStateChange: (event: any) => {
          // Save progress when paused or ended
          if (event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED) {
            if (playerRef.current?.getCurrentTime) {
              const currentTime = playerRef.current.getCurrentTime();
              localStorage.setItem(storageKey, currentTime.toString());
              setSavedTime(currentTime);
            }
          }
        },
      },
    });
  };

  // Save progress periodically
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 0) {
          localStorage.setItem(storageKey, currentTime.toString());
        }
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [isReady, storageKey]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResume = () => {
    if (playerRef.current?.seekTo && savedTime) {
      playerRef.current.seekTo(savedTime, true);
      playerRef.current.playVideo?.();
    }
  };

  const handleRestart = () => {
    localStorage.removeItem(storageKey);
    setSavedTime(null);
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(0, true);
      playerRef.current.playVideo?.();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Resume banner */}
      {savedTime && savedTime > 10 && (
        <div className="bg-primary/10 border-b px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            You left off at <span className="font-medium text-foreground">{formatTime(savedTime)}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleResume}
              className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Resume
            </button>
            <button
              onClick={handleRestart}
              className="px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Video container */}
      <div className="flex-1 bg-black flex items-center justify-center min-h-[300px]">
        <div className="w-full h-full aspect-video max-h-[70vh]">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>

      {/* Video title */}
      {title && (
        <div className="px-4 py-3 border-t bg-card">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
    </div>
  );
}
