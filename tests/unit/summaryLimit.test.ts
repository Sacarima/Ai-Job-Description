import { describe, it, expect } from "vitest";
import { buildFallbackSummary } from "@/lib/parsing/summary";

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}


const SUMMARY_WORD_LIMIT = 60;

describe("buildFallbackSummary", () => {
  it(`never returns more than ${SUMMARY_WORD_LIMIT} words`, () => {
    const longJd = `
      We’re looking for someone to help us modernize our stack and own a bunch of stuff
      across product, infra, and data. You’ll be the go-to person for everything front to back:
      talking to users, scoping features with design, tweaking CSS when needed, and also
      getting your hands dirty with our APIs and pipelines.

      We currently build things mostly in TypeScript and React, with a bit of Node and some
      Python scripts around. There’s some Terraform and Docker in the mix, plus whatever our
      current cloud vendor supports. We don’t have proper titles, but this is not an entry-level role;
      you’ll be expected to mentor others and make technical decisions.

      Comp is competitive for the market; we can discuss ranges during the process.
    `.repeat(3); 

    const summary = buildFallbackSummary(longJd, undefined);
    const words = countWords(summary);

    expect(words).toBeLessThanOrEqual(SUMMARY_WORD_LIMIT);
  });
});
