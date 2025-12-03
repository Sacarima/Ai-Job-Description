import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";
import type { getExtractor } from "@/lib/extractors";
import { generateSkillMatrixFromLlm } from "@/lib/llm/skillMatrixLlm";

export class LlmExtractor implements ReturnType<typeof getExtractor> {
  constructor(private readonly fallback: ReturnType<typeof getExtractor>) {}

  async extract(jd: string): Promise<SkillMatrix> {
    try {
      const result = await generateSkillMatrixFromLlm(jd);
      return result;
    } catch (err) {
      console.error("LLM extractor failed, falling back:", err);
      return this.fallback.extract(jd);
    }
  }
}
