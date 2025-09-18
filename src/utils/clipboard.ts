import { htmlToPlainText } from "@/utils/plain-text";
import { sanitizeHtml } from "@/utils/html";

export function buildClipboardPayload(html: string) {
  const safeHtml = sanitizeHtml(html);
  const plainText = htmlToPlainText(safeHtml);
  return { html: safeHtml, text: plainText };
}

export async function copyToClipboard(html: string) {
  const payload = buildClipboardPayload(html);
  const supportsRichClipboard =
    typeof navigator !== "undefined" &&
    typeof window !== "undefined" &&
    "clipboard" in navigator &&
    "write" in navigator.clipboard &&
    typeof window.ClipboardItem !== "undefined";

  if (supportsRichClipboard) {
    const data = [
      new window.ClipboardItem({
        "text/html": new Blob([payload.html], { type: "text/html" }),
        "text/plain": new Blob([payload.text], { type: "text/plain" })
      })
    ];
    await navigator.clipboard.write(data);
    return payload;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload.text);
  }

  return payload;
}
