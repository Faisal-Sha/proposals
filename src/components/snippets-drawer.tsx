"use client";

import { snippets } from "@/data/snippets";
import { Button } from "@/components/ui/button";

export function SnippetsDrawer({ onInsert }: { onInsert: (snippet: string) => void }) {
  const grouped = snippets.reduce<Record<string, typeof snippets>>(
    (acc, snippet) => {
      acc[snippet.category] = acc[snippet.category] ?? [];
      acc[snippet.category].push(snippet);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background p-4 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Snippets
      </h3>
      <div className="space-y-4 text-sm">
        {Object.entries(grouped).map(([category, list]) => (
          <div key={category} className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </div>
            <div className="space-y-2">
              {list.map((snippet) => (
                <div
                  key={snippet.id}
                  className="rounded-md border border-dashed border-border p-3"
                >
                  <div className="mb-2 font-medium">{snippet.name}</div>
                  <p className="text-muted-foreground">{snippet.content}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="mt-3"
                    onClick={() => onInsert(snippet.content)}
                  >
                    Insert
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
