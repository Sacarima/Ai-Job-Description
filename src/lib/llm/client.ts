import OpenAI from "openai";
import { env, llmConfig } from "@/lib/config/env";
import { SkillMatrixSchema, MAX_SUMMARY_WORDS } from "@/lib/schema/skillMatrixSchema";
import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

const MODEL_NAME = "gpt-4o-mini";

export const openaiClient =
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
  "salary"?: { "currency": "USD" | "EUR" | "PLN" | "GBP", "min"?: number, "max"?: number },
  "summary": string  // at most ${MAX_SUMMARY_WORDS} words
}

STRICT RULES:
- Respond with JSON ONLY, no markdown, no explanation, no backticks.
- "summary" MUST be at most ${MAX_SUMMARY_WORDS} words and be a single concise paragraph.
- Never include labels like "Title:" or "Role:" inside the "title" field. Just the role name (e.g. "Senior Full-Stack Engineer").
- If salary is NOT mentioned, OMIT the "salary" field entirely (do NOT set it to null or 0).
- If salary IS mentioned:
  - Detect the currency symbol or code (€, EUR, $, USD, PLN, GBP).
  - Convert ranges to numbers and fill "min" and "max" using annual amounts when possible.
  - If only one number is given, put it in BOTH "min" and "max".

Seniority inference:
- If the description mentions 5+ years, strong ownership, leading initiatives, or very high autonomy → "senior".
- If it mentions leading a team, being tech lead, or head of engineering → "lead".
- If it clearly says "junior", "graduate", "entry-level" → "junior".
- If it mentions ~3–5 years experience and solid ownership but not leadership → "mid".
- If you really cannot infer anything → "unknown" (avoid this when there is any signal).

Skills classification:
- frontend: React, Next.js, TypeScript (frontend usage), HTML, CSS, Tailwind, Redux, React Query, UI libraries, frontend frameworks.
- backend: Node.js, Express, NestJS, REST APIs, GraphQL, MongoDB, PostgreSQL, Redis, background jobs, queues.
- devops: Docker, Kubernetes, AWS/GCP/Azure, CI/CD, GitHub Actions, monitoring, logging, infra tools.
- web3: solidity, Ethers.js, wagmi, viem, Merkle trees, staking, ERC-20, EVM or other blockchain-specific tools.
- other: testing tools (Jest, RTL, Cypress, Playwright), methodologies, or technical items that do not fit above.

Requirements extraction:
- "mustHave" should contain 5–10 short requirement sentences or phrases that represent HARD requirements
  (e.g. "5+ years building production web applications", "Strong React and Node.js experience", "Experience with MongoDB or another document database").
- "niceToHave" should contain 3–10 short bullet-style items that are explicitly labeled as "nice to have", "bonus", or clearly optional.
- Do NOT leave "mustHave" and "niceToHave" empty if the job description contains requirements.
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
    response_format: { type: "json_object" },
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
      response_format: { type: "json_object" },
    });

    const fixedRaw = fixCompletion.choices[0]?.message?.content ?? "";
    raw = fixedRaw;

    try {
      parsed = JSON.parse(fixedRaw);
    } catch (fixErr) {
      throw new Error("LLM did not return valid JSON even after fix attempt");
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
