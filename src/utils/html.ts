import createDOMPurify from "dompurify";
import type { DOMPurifyI } from "dompurify";

export const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "a"
] as const;

export type AllowedTag = (typeof ALLOWED_TAGS)[number];

const allowedAttributes: Record<string, string[]> = {
  a: ["href", "rel", "target"]
};

const purifierCache = new WeakMap<Window, DOMPurifyI>();

function ensureEnv(): { window: Window & typeof globalThis; document: Document } {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return { window: window as Window & typeof globalThis, document };
  }

  const jsdom = (eval("require")("jsdom") as typeof import("jsdom")).JSDOM;
  const { window: jsdomWindow } = new jsdom(
    "<!doctype html><html><body></body></html>",
    {
      url: "https://example.com"
    }
  );

  return {
    window: jsdomWindow as unknown as Window & typeof globalThis,
    document: jsdomWindow.document
  };
}

function getPurifier(win: Window & typeof globalThis) {
  const existing = purifierCache.get(win);
  if (existing) return existing;
  const purifier = createDOMPurify(win);
  purifierCache.set(win, purifier);
  return purifier;
}

export function createDocumentFromHtml(html: string) {
  const env = ensureEnv();
  const doc = env.document.implementation.createHTMLDocument("");
  doc.body.innerHTML = html;
  return { document: doc, window: env.window };
}

export function sanitizeHtml(html: string) {
  const normalized = html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis, "<p><strong>$1</strong></p>")
    .replace(/<div[^>]*>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>");
  const env = ensureEnv();
  const purifier = getPurifier(env.window);

  const sanitized = purifier.sanitize(normalized, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: allowedAttributes,
    USE_PROFILES: { html: false },
    KEEP_CONTENT: false,
    FORBID_ATTR: ["style", "class", "id"],
    RETURN_DOM: false
  });

  const { document: doc } = createDocumentFromHtml(sanitized as string);

  Array.from(doc.body.childNodes).forEach((node) => {
    if (node.nodeType === env.window.Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        const paragraph = doc.createElement("p");
        paragraph.textContent = text;
        node.parentNode?.replaceChild(paragraph, node);
      } else {
        node.parentNode?.removeChild(node);
      }
    }
  });

  doc.querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) {
      anchor.replaceWith(anchor.textContent ?? "");
      return;
    }

    anchor.setAttribute("rel", "nofollow noopener");
    anchor.setAttribute("target", "_blank");

    const text = anchor.textContent?.trim() ?? "";
    if (!text || !text.includes(href)) {
      anchor.textContent = text ? `${text} (${href})` : href;
    }
  });

  doc.querySelectorAll("li").forEach((item) => {
    if (!item.textContent?.trim()) return;
    if (!item.innerHTML.startsWith("\u200B")) {
      item.innerHTML = `\u200B${item.innerHTML}`;
    }
    if (!item.innerHTML.endsWith("\u200B")) {
      item.innerHTML = `${item.innerHTML}\u200B`;
    }
  });

  return doc.body.innerHTML;
}

export function sanitizeForPreview(html: string) {
  const clean = sanitizeHtml(html);
  const { document: doc } = createDocumentFromHtml(clean);

  doc.querySelectorAll("code").forEach((node) => {
    node.setAttribute("style", "");
  });

  return doc.body.innerHTML;
}
