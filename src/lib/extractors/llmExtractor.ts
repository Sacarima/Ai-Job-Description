import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";
import { generateSkillMatrixFromLlm } from "@/lib/llm/skillMatrixLlm";

export interface BasicExtractor {
  extract(jd: string): Promise<SkillMatrix>;
}

export class LlmExtractor implements BasicExtractor {
  constructor(private readonly fallback: BasicExtractor) {}

  async extract(jd: string): Promise<SkillMatrix> {
    try {
      const result = await generateSkillMatrixFromLlm(jd);
      return result;
    } catch (err) {
      console.error("LlmExtractor failed, using fallback instead:", err);
      return this.fallback.extract(jd);
    }
  }
}
