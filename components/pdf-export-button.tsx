"use client";

import { useState, useRef } from "react";
import { Download, Loader2 } from "lucide-react";

interface PDFExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  filename: string;
  title?: string;
}

export function PDFExportButton({ contentRef, filename, title }: PDFExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!contentRef.current) return;

    setExporting(true);

    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;

      const element = contentRef.current;

      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${filename}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={title || "Export as PDF"}
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Export PDF</span>
        </>
      )}
    </button>
  );
}
