"use client";

import * as React from "react";
import { sanitizeForPreview } from "@/utils/html";

export function SanitizedPreview({ html }: { html: string }) {
  const [clean, setClean] = React.useState(() => sanitizeForPreview(html));

  React.useEffect(() => {
    setClean(sanitizeForPreview(html));
  }, [html]);

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
