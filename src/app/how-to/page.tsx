import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Paste into Upwork",
  description: "Step-by-step guide for testing and pasting your proposal into Upwork."
};

const steps = [
  {
    title: "Draft and polish",
    body:
      "Use the editor to complete every section. Keep an eye on the character limit, grade level, and quality hints."
  },
  {
    title: "Preview like Upwork",
    body:
      "Toggle the Upwork Preview panel and the Plain-Text fallback. Make sure links show the URL and lists look right."
  },
  {
    title: "Copy with one click",
    body:
      "Use \"Copy Upwork-Safe HTML\". It writes both HTML and plain text to your clipboard in case Upwork strips tags."
  },
  {
    title: "Paste and verify",
    body:
      "Paste into the Upwork proposal editor. If it looks off, use the Paste-Test helper on the main page to debug."
  }
];

export default function HowToPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">How to paste into Upwork</h1>
        <p className="text-sm text-muted-foreground">
          Follow these quick checkpoints and the proposal will survive every Upwork editor.
        </p>
      </div>
      <ol className="space-y-4 text-sm">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="rounded-lg border border-border bg-background p-4 shadow-sm"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Step {index + 1}
            </div>
            <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted-foreground">
        Ready to build? <Link href="/" className="font-medium text-foreground underline">Back to the editor</Link>.
      </p>
    </div>
  );
}
