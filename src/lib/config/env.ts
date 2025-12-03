import { z } from "zod";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_LLM_ENABLED: z.enum(["true", "false"]).optional().default("false"),
  NEXT_PUBLIC_LLM_STREAM_ENABLED: z.enum(["true", "false"]).optional().default("false"),
  LLM_MAX_CALLS: z.coerce.number().int().positive().optional().default(20),
});

const rawEnv = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PUBLIC_LLM_ENABLED: process.env.NEXT_PUBLIC_LLM_ENABLED,
  NEXT_PUBLIC_LLM_STREAM_ENABLED: process.env.NEXT_PUBLIC_LLM_STREAM_ENABLED,
  LLM_MAX_CALLS: process.env.LLM_MAX_CALLS,
};

const parsed = EnvSchema.parse(rawEnv);

export const env = parsed;

export const llmConfig = {
  enabled: parsed.NEXT_PUBLIC_LLM_ENABLED === "true" && !!parsed.OPENAI_API_KEY,

  streamEnabled: parsed.NEXT_PUBLIC_LLM_STREAM_ENABLED === "true",

  maxCalls: parsed.LLM_MAX_CALLS,
};
