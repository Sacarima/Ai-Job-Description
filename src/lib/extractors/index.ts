import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";
import { inferSeniority } from "@/lib/parsing/seniority";
import { extractSkills } from "@/lib/parsing/skills";
import { extractSalary } from "@/lib/parsing/salary";
import { extractMustNice } from "@/lib/parsing/mustNice";
import { buildFallbackSummary } from "@/lib/parsing/summary";
import { generateSkillMatrixFromLlm } from "@/lib/llm/skillMatrixLlm";
import { llmConfig } from "@/lib/config/env";

export interface BasicExtractor {
  extract(jd: string): Promise<SkillMatrix>;
}

export class LlmExtractor implements BasicExtractor {
  constructor(private readonly fallback: BasicExtractor) {}

  async extract(jd: string): Promise<SkillMatrix> {
    try {
      const result = await generateSkillMatrixFromLlm(jd);

      if (result.summary && !result.summary.startsWith("[LLM]")) {
        result.summary = `[LLM] ${result.summary}`;
      }

      return result;
    } catch (err) {
      console.error("LlmExtractor failed, using fallback instead:", err);
      return this.fallback.extract(jd);
    }
  }
}

export class FallbackExtractor implements BasicExtractor {
  async extract(jd: string): Promise<SkillMatrix> {
    const normalized = jd.replace(/\s+/g, " ").trim();

    const title = inferTitle(jd);
    const seniority = inferSeniority(normalized);
    const skills = extractSkills(normalized);
    const salary = extractSalary(normalized);
    const { mustHave, niceToHave } = extractMustNice(jd);
    const summary = buildFallbackSummary(jd, salary);

    return {
      title,
      seniority,
      skills,
      mustHave,
      niceToHave,
      salary,
      summary,
    };
  }
}

function inferTitle(jd: string): string {
  const lines = jd
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return "Untitled role";

  const first = lines[0];
  if (first.length <= 80) return first;

  return first.slice(0, 80);
}

let extractorInstance: BasicExtractor | null = null;

export function getExtractor(): BasicExtractor {
  if (extractorInstance) return extractorInstance;

  const fallback = new FallbackExtractor();

  if (llmConfig.enabled) {
    extractorInstance = new LlmExtractor(fallback);
  } else {
    extractorInstance = fallback;
  }

  return extractorInstance;
}
