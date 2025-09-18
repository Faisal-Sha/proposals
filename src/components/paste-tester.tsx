"use client";

import * as React from "react";
import { sanitizeForPreview } from "@/utils/html";

export function PasteTester() {
  const [preview, setPreview] = React.useState("");
  const sandboxRef = React.useRef<HTMLDivElement>(null);

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    const next = html || text;
    const sanitized = sanitizeForPreview(next);
    setPreview(sanitized);
    if (sandboxRef.current) {
      sandboxRef.current.innerHTML = sanitized;
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
      <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Paste-test helper
      </div>
      <div
        ref={sandboxRef}
        onPaste={handlePaste}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[120px] rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
      >
        Paste here to simulate Upwork’s sanitiser.
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <p className="text-xs">Sanitized preview:</p>
        <div dangerouslySetInnerHTML={{ __html: preview }} />
      </div>
    </div>
  );
}
