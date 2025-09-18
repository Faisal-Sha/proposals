import readingTime from "reading-time";
import { spamPhrases } from "@/data/spam";

export type QualityInsight = {
  id: string;
  label: string;
  severity: "info" | "warn" | "error";
};

const CTA_KEYWORDS = [
  "schedule",
  "book",
  "call",
  "chat",
  "walk",
  "review",
  "plan",
  "map",
  "start",
  "ready",
  "hire",
  "next"
];

const QUESTION_WORDS = ["?", "how", "what", "when", "where", "which", "can you"];

function tokenizeSentences(text: string) {
  const sentences = text
    .split(/[.!?]+\s/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return sentences.length || !text.trim() ? sentences : [text.trim()];
}

function tokenizeWords(text: string) {
  return text
    .toLowerCase()
    .match(/[a-zA-ZÀ-ÿ0-9']+/g)
    ?.filter(Boolean) ?? [];
}

function countSyllables(word: string) {
  const sanitized = word.toLowerCase();
  if (sanitized.length <= 3) return 1;
  const pattern = sanitized
    .replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/g, "")
    .replace(/^y/, "");
  const matches = pattern.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function fleschKincaidGrade(text: string) {
  const sentences = tokenizeSentences(text);
  const words = tokenizeWords(text);
  if (!sentences.length || !words.length) return 0;

  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  const grade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  return Number.isFinite(grade) ? Number(Math.max(0, grade).toFixed(1)) : 0;
}

export function analyzeContent(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const wordCount = tokenizeWords(text).length;
  const characterCount = text.replace(/\s/g, "").length;
  const sentences = tokenizeSentences(text);
  const avgSentenceLength = sentences.length ? wordCount / sentences.length : 0;
  const readStats = readingTime(text || "0", { wordsPerMinute: 220 });

  const hasQuestion = QUESTION_WORDS.some((token) =>
    normalized.toLowerCase().includes(token)
  );
  const hasCta = CTA_KEYWORDS.some((token) =>
    normalized.toLowerCase().includes(token)
  );
  const emojiMatches = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) ?? [];

  const hints: QualityInsight[] = [];
  if (wordCount > 0 && wordCount / (text.split(/\n\n/).length || 1) > 160) {
    hints.push({ id: "wall", label: "Break up the wall of text with shorter paragraphs.", severity: "warn" });
  }
  if (!hasQuestion) {
    hints.push({ id: "question", label: "Add a clarifying question to show collaboration.", severity: "warn" });
  }
  if (!hasCta) {
    hints.push({ id: "cta", label: "Close with a direct CTA (invite them to act).", severity: "error" });
  }

  const iCount = (text.match(/\b(i|we)\b/gi) ?? []).length;
  const youCount = (text.match(/\byou\b/gi) ?? []).length;
  if (youCount && iCount / youCount > 2.5) {
    hints.push({ id: "pronoun", label: "Talk more about the client than yourself.", severity: "info" });
  }
  if (emojiMatches.length > 6) {
    hints.push({ id: "emoji", label: "Ease up on the emojis for professional tone.", severity: "info" });
  }

  const spamMatches = spamPhrases.filter((phrase) =>
    normalized.toLowerCase().includes(phrase)
  );

  const gradeLevel = fleschKincaidGrade(text);

  let score = 100;
  score -= Math.min(30, Math.max(0, avgSentenceLength - 22) * 1.5);
  score -= hints.filter((hint) => hint.severity === "error").length * 25;
  score -= hints.filter((hint) => hint.severity === "warn").length * 15;
  score -= spamMatches.length * 5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    wordCount,
    characterCount,
    sentences: sentences.length,
    avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
    readTimeMinutes: Math.max(1, Math.round(readStats.minutes * 10) / 10),
    spamMatches,
    hints,
    score,
    gradeLevel,
    emojiCount: emojiMatches.length
  };
}
