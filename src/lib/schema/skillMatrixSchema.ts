import { z } from "zod";

export const ExtractRequestSchema = z.object({
  jd: z
    .string()
    .min(10, "Job description is too short. Please provide more details.")
    .max(20000, "Job description is too long. Please shorten it."),
});

export const MAX_SUMMARY_WORDS = 60;

export function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export const SkillMatrixSchema = z.object({
  title: z.string(),
  seniority: z.enum(["junior", "mid", "senior", "lead", "unknown"]),
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    devops: z.array(z.string()),
    web3: z.array(z.string()),
    other: z.array(z.string()),
  }),
  mustHave: z.array(z.string()),
  niceToHave: z.array(z.string()),
  salary: z
    .object({
      currency: z.enum(["USD", "EUR", "PLN", "GBP"]),
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  summary: z
    .string()
    .max(500, "Summary is too long.")
    .refine(
      (value) => countWords(value) <= MAX_SUMMARY_WORDS,
      `Summary must be at most ${MAX_SUMMARY_WORDS} words.`,
    ),
});

export type ExtractRequest = z.infer<typeof ExtractRequestSchema>;
export type SkillMatrix = z.infer<typeof SkillMatrixSchema>;
