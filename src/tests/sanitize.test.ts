import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "@/utils/html";

describe("sanitizeHtml", () => {
  it("removes disallowed tags and attributes", () => {
    const dirty = '<div style="color:red"><h1>Hello</h1><p data-test="x"><span>World</span></p></div>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toContain("<p><strong>Hello</strong></p>");
    expect(clean).toContain("<p>World</p>");
    expect(clean).not.toContain("div");
    expect(clean).not.toContain("style=");
    expect(clean).not.toContain("span");
  });

  it("keeps links with rel and target and appends url to text", () => {
    const dirty = '<a href="https://example.com">Example</a>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toBe(
      '<a href="https://example.com" rel="nofollow noopener" target="_blank">Example (https://example.com)</a>'
    );
  });
});
