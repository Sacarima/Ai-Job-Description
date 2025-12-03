import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

type Salary = SkillMatrix["salary"];

const SUMMARY_WORD_LIMIT = 60;

function trimToWordLimit(text: string, maxWords: number = SUMMARY_WORD_LIMIT): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ") + "…";
}

export function buildFallbackSummary(jd: string, salary?: Salary): string {
  const normalized = jd.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "Role summary not available.";
  }

  const paragraphs = jd
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  let candidate = paragraphs[0] ?? normalized;

  for (const p of paragraphs) {
    const lower = p.toLowerCase();
    if (
      lower.includes("role") ||
      lower.includes("you will") ||
      lower.includes("we are looking") ||
      lower.includes("we are hiring")
    ) {
      candidate = p;
      break;
    }
  }

  const firstSentence = candidate.split(/[.!?]/)[0] ?? candidate;

  const base = firstSentence.replace(/\s+/g, " ").trim();
  let summary = base;

  const salarySnippet = buildSalarySnippet(salary);
  if (salarySnippet) {
    const combined = base.endsWith(".") ? `${base} ${salarySnippet}` : `${base}. ${salarySnippet}`;
    summary = combined;
  }

  return trimToWordLimit(summary);
}

function buildSalarySnippet(salary?: Salary): string | null {
  if (!salary) return null;

  const { currency, min, max } = salary;

  const format = (n: number | undefined) =>
    typeof n === "number" ? n.toLocaleString("en-US") : undefined;

  if (typeof min === "number" && typeof max === "number" && min !== max) {
    return `Salary: ${format(min)}–${format(max)} ${currency}.`;
  }

  if (typeof min === "number") {
    return `Salary: ${format(min)} ${currency}.`;
  }

  if (typeof max === "number") {
    return `Salary: up to ${format(max)} ${currency}.`;
  }

  return `Salary: ${currency}.`;
}
