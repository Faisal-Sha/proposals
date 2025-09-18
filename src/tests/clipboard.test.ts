import { describe, expect, it } from "vitest";
import { buildClipboardPayload } from "@/utils/clipboard";

const sample = `<p><strong>Hello</strong> there</p><ul><li>• item</li></ul>`;

describe("buildClipboardPayload", () => {
  it("returns sanitized html and markdown-like plain text", () => {
    const payload = buildClipboardPayload(sample);
    expect(payload.html).toContain("<strong>Hello</strong>");
    expect(payload.html).not.toContain("style=");
    expect(payload.text).toContain("**Hello** there");
    expect(payload.text).toContain("• item");
  });
});
