import OpenAI from "openai";
import { env, llmConfig } from "@/lib/config/env";
import { SkillMatrixSchema, MAX_SUMMARY_WORDS } from "@/lib/schema/skillMatrixSchema";
import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

const MODEL_NAME = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const openaiClient =
  env.OPENAI_API_KEY && llmConfig.enabled ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

function trimSummaryToWordLimit(summary: string): string {
  const words = summary.trim().split(/\s+/).filter(Boolean);
  if (words.length <= MAX_SUMMARY_WORDS) {
    return summary.trim();
  }
  return words.slice(0, MAX_SUMMARY_WORDS).join(" ") + "…";
}

async function callLlmOnce(jd: string): Promise<string> {
  if (!openaiClient || !llmConfig.enabled) {
    throw new Error("LLM is not configured");
  }

  const system = `
You are a strict JSON generator for job descriptions.

Given a job description, you MUST return a JSON object EXACTLY matching this shape:

{
  "title": string,
  "seniority": "junior" | "mid" | "senior" | "lead" | "unknown",
  "skills": {
    "frontend": string[],
    "backend": string[],
    "devops": string[],
    "web3": string[],
    "other": string[]
  },
  "mustHave": string[],
  "niceToHave": string[],
  "salary": { "currency": "USD" | "EUR" | "PLN" | "GBP", "min"?: number, "max"?: number } | null,
  "summary": string  // at most ${MAX_SUMMARY_WORDS} words
}

Rules:
- Respond with JSON ONLY, no markdown, no explanation.
- "summary" MUST be at most ${MAX_SUMMARY_WORDS} words.
- If salary is not mentioned, use null for "salary".
`.trim();

  const user = `
Job description:
${jd}
`.trim();

  const completion = await openaiClient.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return raw;
}

export async function generateSkillMatrixFromLlm(jd: string): Promise<SkillMatrix> {
  if (!openaiClient || !llmConfig.enabled) {
    throw new Error("LLM is not configured");
  }

  let raw = await callLlmOnce(jd);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const fixSystem = `
You previously returned invalid JSON. I will now send you that invalid JSON.
You must respond with a corrected JSON object that exactly matches the required schema.
Do not add any commentary or formatting, respond with JSON only.
`.trim();

    const fixUser = `
Original invalid JSON:
${raw}
`.trim();

    const fixCompletion = await openaiClient!.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: fixSystem },
        { role: "user", content: fixUser },
      ],
      temperature: 0,
    });

    const fixedRaw = fixCompletion.choices[0]?.message?.content ?? "";
    raw = fixedRaw;

    try {
      parsed = JSON.parse(fixedRaw);
    } catch (fixErr) {
      throw new Error("LLM did not return valid JSON even after fix attempt");
    }
  }
  if (parsed && typeof parsed === "object" && "salary" in parsed) {
    const salary = (parsed as any).salary;
    if (salary === null) {
      delete (parsed as any).salary;
    }
  }

  if (parsed && typeof parsed === "object" && "summary" in parsed) {
    const summary = (parsed as any).summary;
    if (typeof summary === "string") {
      (parsed as any).summary = trimSummaryToWordLimit(summary);
    }
  }

  const validated = SkillMatrixSchema.parse(parsed);
  return validated;
}
