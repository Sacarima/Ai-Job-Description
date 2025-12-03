interface MustNice {
  mustHave: string[];
  niceToHave: string[];
}

const MUST_HEADINGS = ["requirements", "must have", "what you bring", "what we expect"];

const NICE_HEADINGS = ["nice to have", "bonus", "preferred", "good to have"];

export function extractMustNice(jd: string): MustNice {
  const lines = jd.split("\n");
  const mustHave: string[] = [];
  const niceToHave: string[] = [];

  let current: "none" | "must" | "nice" = "none";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const lower = line.toLowerCase();
    if (!line) continue;

    if (MUST_HEADINGS.some((h) => lower.includes(h))) {
      current = "must";
      continue;
    }

    if (NICE_HEADINGS.some((h) => lower.includes(h))) {
      current = "nice";
      continue;
    }

    if (/^[-*•]/.test(line)) {
      const item = line.replace(/^[-*•]\s*/, "").trim();
      if (!item) continue;

      if (current === "must") mustHave.push(item);
      else if (current === "nice") niceToHave.push(item);
      continue;
    }
  }

  return { mustHave, niceToHave };
}
