import { describe, expect, it } from "vitest";
import { htmlToPlainText } from "@/utils/plain-text";

describe("htmlToPlainText", () => {
  it("converts basic formatting to markdown-like syntax", () => {
    const html = '<p><strong>Bold</strong> and <em>italic</em> plus <u>underline</u>.</p>';
    const text = htmlToPlainText(html);
    expect(text).toBe("**Bold** and *italic* plus _underline_.");
  });

  it("handles ordered and unordered lists", () => {
    const html = '<p>Intro</p><ul><li>First</li><li>Second</li></ul><ol><li>One</li><li>Two</li></ol>';
    const text = htmlToPlainText(html);
    expect(text).toContain("Intro");
    expect(text).toContain("• First\n• Second");
    expect(text).toContain("1. One\n2. Two");
  });
});
