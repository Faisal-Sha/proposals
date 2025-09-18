"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Toolbar } from "@/components/toolbar";
import { TemplatePicker } from "@/components/template-picker";
import { VariablesPanel } from "@/components/variables-panel";
import { SnippetsDrawer } from "@/components/snippets-drawer";
import { QualityHints } from "@/components/quality-hints";
import { SanitizedPreview } from "@/components/sanitized-preview";
import { ClipboardButton } from "@/components/clipboard-button";
import { PasteTester } from "@/components/paste-tester";
import { SettingsDialog } from "@/components/settings-dialog";
import { useProposalStore } from "@/store/use-proposal-store";
import { analyzeContent } from "@/utils/analysis";
import { sanitizeHtml } from "@/utils/html";
import { htmlToPlainText } from "@/utils/plain-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CHAR_LIMIT = 5000;

export function ProposalEditor() {
  const html = useProposalStore((state) => state.html);
  const setHtml = useProposalStore((state) => state.setHtml);
  const [viewMode, setViewMode] = React.useState<"preview" | "plaintext">("preview");

  const editor = useEditor({
    content: html || "<p></p>",
    extensions: [
      StarterKit.configure({
        heading: false,
        dropcursor: {
          class: "tiptap-dropcursor"
        },
        horizontalRule: false,
        strike: false,
        history: true
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "nofollow noopener",
          target: "_blank"
        }
      }),
      Placeholder.configure({
        placeholder:
          "Craft your hook, proof, plan, CTA… Smart shortcuts like **bold** and 1. start lists."
      }),
      CharacterCount.configure({ limit: CHAR_LIMIT + 1000 })
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert focus:outline-none min-h-[480px] leading-relaxed"
      }
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      setHtml(html);
    }
  });

  React.useEffect(() => {
    if (!editor) return;
    if (html && html !== editor.getHTML()) {
      editor.commands.setContent(html, false);
    }
  }, [editor, html]);

  React.useEffect(() => {
    if (!editor) return;
    const interval = window.setInterval(() => {
      setHtml(editor.getHTML());
    }, 2000);
    return () => window.clearInterval(interval);
  }, [editor, setHtml]);

  const safeHtml = React.useMemo(() => sanitizeHtml(html ?? ""), [html]);
  const plainText = React.useMemo(() => htmlToPlainText(safeHtml), [safeHtml]);
  const stats = React.useMemo(() => analyzeContent(plainText), [plainText]);

  const handleTemplateApply = (html: string) => {
    editor?.commands.setContent(html, false);
    setHtml(html);
  };

  const insertContent = (content: string) => {
    if (!editor) return;
    const lines = content.split(/\n+/).map((line) => line.trim()).filter(Boolean);

    if (
      lines.length > 1 &&
      lines.every((line) => line.startsWith("•") || /^\d+[.)]/.test(line))
    ) {
      const ordered = lines.every((line) => /^\d+[.)]/.test(line));
      const listItems = lines
        .map((line) => {
          if (line.startsWith("•")) {
            return `<li>${line.replace(/^•\s*/, "")}</li>`;
          }
          const match = line.match(/^(\d+)[.)]\s*(.*)$/);
          return `<li>${match ? match[2] : line}</li>`;
        })
        .join("");
      const listHtml = ordered ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
      editor.chain().focus().insertContent(listHtml).run();
      return;
    }

    const htmlBlock = `<p>${content}</p>`;
    editor.chain().focus().insertContent(htmlBlock).run();
  };

  const charactersUsed = stats.characterCount;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Proposal Builder</h1>
          <p className="text-sm text-muted-foreground">
            Write once → paste once → Upwork keeps your formatting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardButton html={safeHtml} mode="html" />
          <ClipboardButton html={safeHtml} mode="text" />
          <SettingsDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Toolbar editor={editor} />
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-background p-4 shadow-inner">
                <EditorContent editor={editor} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {stats.wordCount} words • {charactersUsed}/{CHAR_LIMIT} characters
                </span>
                {charactersUsed > CHAR_LIMIT ? (
                  <span className="text-red-500">⚠️ Upwork trims after {CHAR_LIMIT} characters.</span>
                ) : null}
                <span>{stats.sentences} sentences • {stats.readTimeMinutes} min read</span>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant={viewMode === "preview" ? "default" : "secondary"}
              size="sm"
              onClick={() => setViewMode("preview")}
            >
              Upwork preview
            </Button>
            <Button
              type="button"
              variant={viewMode === "plaintext" ? "default" : "secondary"}
              size="sm"
              onClick={() => setViewMode("plaintext")}
            >
              Plain-text fallback
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            {viewMode === "preview" ? (
              <SanitizedPreview html={safeHtml} />
            ) : (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {plainText}
              </pre>
            )}
          </div>
          <PasteTester />
        </div>
        <div className="space-y-4">
          <TemplatePicker onApply={handleTemplateApply} />
          <VariablesPanel />
          <SnippetsDrawer onInsert={insertContent} />
          <QualityHints
            wordCount={stats.wordCount}
            characterCount={charactersUsed}
            readTimeMinutes={stats.readTimeMinutes}
            gradeLevel={stats.gradeLevel}
            avgSentenceLength={stats.avgSentenceLength}
            spamMatches={stats.spamMatches}
            hints={stats.hints}
            score={stats.score}
            emojiCount={stats.emojiCount}
            charLimit={CHAR_LIMIT}
          />
        </div>
      </div>
    </div>
  );
}
