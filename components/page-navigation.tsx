import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationLink {
  title: string;
  href: string;
}

interface PageNavigationProps {
  prev?: NavigationLink | null;
  next?: NavigationLink | null;
  className?: string;
}

export function PageNavigation({
  prev,
  next,
  className,
}: PageNavigationProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between border-t pt-6 mt-12",
        className
      )}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide">Previous</div>
            <div className="font-medium">{prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-right"
        >
          <div>
            <div className="text-xs uppercase tracking-wide">Next</div>
            <div className="font-medium">{next.title}</div>
          </div>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
