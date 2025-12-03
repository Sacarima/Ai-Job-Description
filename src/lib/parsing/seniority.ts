import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

type Seniority = SkillMatrix["seniority"];

export function inferSeniority(text: string): Seniority {
  const t = text || "";
  const trimmed = t.trim();
  if (!trimmed) return "unknown";

  const lower = trimmed.toLowerCase();

  const isNegatedEntryLevel = /\bnot\s+(an?\s+)?entry[-\s]?level\b/i.test(lower);

  const hasJuniorSignal =
    /\bjunior\b/i.test(t) ||
    /\bjr\b/i.test(t) ||
    /\bjr\.\b/i.test(t) ||
    (/\bentry[-\s]?level\b/i.test(t) && !isNegatedEntryLevel);

  if (hasJuniorSignal) {
    return "junior";
  }

  const hasMidSignal =
    /\bmid[-\s]?level\b/i.test(t) ||
    /\bmid\b/i.test(t) ||
    /\bmiddle\b/i.test(t) ||
    /\bregular\b/i.test(t);

  if (hasMidSignal) {
    return "mid";
  }

  const hasLeadSignal =
    /\btech lead\b/i.test(t) ||
    /\bteam lead\b/i.test(t) ||
    /\blead engineer\b/i.test(t) ||
    /\bengineering manager\b/i.test(t) ||
    /\bhead of\b/i.test(t) ||
    /\blead\b/i.test(t);

  if (hasLeadSignal) {
    return "lead";
  }

  const hasSeniorSignal =
    /\bsenior\b/i.test(t) ||
    /\bsr\b/i.test(t) ||
    /\bsr\.\b/i.test(t) ||
    /\bsenior[-\s]?level\b/i.test(t);

  if (hasSeniorSignal) {
    return "senior";
  }

  return "unknown";
}
