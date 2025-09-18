"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { copyToClipboard, buildClipboardPayload } from "@/utils/clipboard";
import { toast } from "sonner";

type ClipboardButtonProps = {
  html: string;
  mode: "html" | "text";
};

export function ClipboardButton({ html, mode }: ClipboardButtonProps) {
  const label = mode === "html" ? "Copy Upwork-Safe HTML" : "Copy Styled Plain Text";

  const handleCopy = async () => {
    try {
      if (mode === "html") {
        await copyToClipboard(html);
      } else {
        const payload = buildClipboardPayload(html);
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(payload.text);
        } else {
          throw new Error("Clipboard plain text API unavailable");
        }
      }
      toast.success(`${label} copied`);
    } catch (error) {
      console.error(error);
      toast.error("Clipboard copy failed. Copy manually as a fallback.");
    }
  };

  return (
    <Button type="button" onClick={handleCopy} variant="default">
      {label}
    </Button>
  );
}
