"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Eraser,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { emojiList } from "@/data/spam";

type ToolbarProps = {
  editor: Editor | null;
};

export function Toolbar({ editor }: ToolbarProps) {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const emojiButtonRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showEmoji &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  if (!editor) return null;

  const applyLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      const sanitizedUrl = new URL(url.trim());
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: sanitizedUrl.toString(), target: "_blank", rel: "nofollow noopener" })
        .run();
    } catch {
      window.alert("Please enter a valid URL including https://");
    }
  };

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji + " ").run();
    setShowEmoji(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background/90 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("italic") ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("underline") ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <div className="h-6 w-px bg-border" aria-hidden />
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bulletList") ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("orderedList") ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("blockquote") ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("code") ? "default" : "secondary"}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="secondary" onClick={applyLink}>
        <Link className="h-4 w-4" />
      </Button>
      <div ref={emojiButtonRef} className="relative">
        <Button
          type="button"
          size="sm"
          variant={showEmoji ? "default" : "secondary"}
          onClick={() => setShowEmoji((prev) => !prev)}
        >
          <Smile className="h-4 w-4" />
        </Button>
        {showEmoji ? (
          <div className="absolute right-0 z-10 mt-2 flex w-40 flex-wrap gap-2 rounded-md border border-border bg-background p-3 shadow-xl">
            {emojiList.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="text-lg"
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="h-6 w-px bg-border" aria-hidden />
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      >
        <Eraser className="h-4 w-4" />
      </Button>
    </div>
  );
}
