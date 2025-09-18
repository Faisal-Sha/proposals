"use client";

import type { QualityInsight } from "@/utils/analysis";

type QualityHintsProps = {
  wordCount: number;
  characterCount: number;
  readTimeMinutes: number;
  gradeLevel: number;
  avgSentenceLength: number;
  spamMatches: string[];
  hints: QualityInsight[];
  score: number;
  emojiCount: number;
  charLimit: number;
};

const getSeverityColor = (severity: QualityInsight["severity"]) => {
  switch (severity) {
    case "error":
      return "text-red-500";
    case "warn":
      return "text-amber-500";
    default:
      return "text-slate-500";
  }
};

export function QualityHints(props: QualityHintsProps) {
  const {
    wordCount,
    characterCount,
    readTimeMinutes,
    gradeLevel,
    avgSentenceLength,
    spamMatches,
    hints,
    score,
    emojiCount,
    charLimit
  } = props;

  const charWarning = characterCount > charLimit;
  const normalizedScore = Math.max(0, Math.min(100, score));

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span><strong>{wordCount}</strong> words</span>
            <span className={charWarning ? "text-red-500" : undefined}>
              <strong>{characterCount}</strong> chars
            </span>
            <span>
              <strong>{readTimeMinutes}</strong> min read
            </span>
            <span>
              Grade <strong>{gradeLevel}</strong>
            </span>
            <span>
              Avg sentence <strong>{avgSentenceLength}</strong>
            </span>
            <span>
              Emojis <strong>{emojiCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16">
                <path
                  className="text-muted-foreground/20"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                />
                <path
                  className="text-foreground"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${normalizedScore}, 100`}
                  d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                {normalizedScore}
              </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Quality score
            </div>
          </div>
        </div>
        {spamMatches.length > 0 ? (
          <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
            ⚠️ Spam trigger phrases: {spamMatches.join(", ")}
          </div>
        ) : null}
        {hints.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {hints.map((hint) => (
              <li key={hint.id} className={getSeverityColor(hint.severity)}>
                • {hint.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            ✅ Looking good! Structure, CTA, and readability are on point.
          </p>
        )}
      </div>
    </div>
  );
}
