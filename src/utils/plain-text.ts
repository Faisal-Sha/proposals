import { createDocumentFromHtml } from "@/utils/html";

function renderInline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const content = Array.from(element.childNodes)
    .map((child) => renderInline(child))
    .join("");

  switch (element.tagName) {
    case "STRONG":
    case "B":
      return content ? `**${content}**` : content;
    case "EM":
    case "I":
      return content ? `*${content}*` : content;
    case "U":
      return content ? `_${content}_` : content;
    case "CODE":
      if (element.parentElement?.tagName === "PRE") {
        return content;
      }
      return content ? `\`${content}\`` : content;
    case "A": {
      const href = element.getAttribute("href") ?? "";
      const text = content.trim() || href;
      return href ? `${text} (${href})` : text;
    }
    case "BR":
      return "\n";
    default:
      return content;
  }
}

function renderList(items: Element[], ordered = false) {
  return items
    .map((item, index) => {
      const marker = ordered ? `${index + 1}.` : "•";
      const text = Array.from(item.childNodes)
        .map((child) => renderInline(child))
        .join("")
        .replace(/\u200B/g, "")
        .trim();
      return text ? `${marker} ${text}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function renderBlock(node: Node): string[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    return text ? [text] : [];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const element = node as HTMLElement;
  switch (element.tagName) {
    case "P": {
      const line = Array.from(element.childNodes)
        .map((child) => renderInline(child))
        .join("")
        .replace(/\u200B/g, "")
        .trim();
      return line ? [line] : [];
    }
    case "UL":
      return renderList(Array.from(element.children), false)
        .split("\n")
        .filter(Boolean);
    case "OL":
      return renderList(Array.from(element.children), true)
        .split("\n")
        .filter(Boolean);
    case "BLOCKQUOTE": {
      const inner = Array.from(element.childNodes)
        .flatMap((child) => renderBlock(child))
        .map((line) => `> ${line}`);
      return inner;
    }
    case "PRE": {
      const code = element.textContent ?? "";
      return ["```", code.trimEnd(), "```"];
    }
    case "BR":
      return [""];
    default:
      return Array.from(element.childNodes).flatMap((child) => renderBlock(child));
  }
}

export function htmlToPlainText(html: string) {
  const { document } = createDocumentFromHtml(html);
  const blocks = Array.from(document.body.childNodes).flatMap((node) =>
    renderBlock(node)
  );

  const cleaned = blocks.join("\n\n");
  return cleaned.replace(/\n{3,}/g, "\n\n").trimEnd();
}
