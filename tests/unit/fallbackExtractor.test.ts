import { describe, it, expect } from "vitest";
import { FallbackExtractor } from "@/lib/extractors/fallbackExtractor";

describe("FallbackExtractor – seniority inference", () => {
  const extractor = new FallbackExtractor();

  it("classifies a clearly senior role as 'senior'", async () => {
    const jd = `
Senior Backend Engineer (Node.js / AWS)

We are hiring a Senior Backend Engineer to design and own our core services.
You will mentor junior developers, review code, and collaborate with product
to deliver reliable APIs.

Requirements:
- 5+ years with Node.js
- Experience with AWS and distributed systems
`;

    const result = await extractor.extract(jd);

    expect(result.seniority).toBe("senior");
  });

  it("keeps a junior role as 'junior' even if body mentions senior engineers", async () => {
    const jd = `
Junior Frontend Developer

You will work closely with our senior engineers to implement new features
in our React-based web application. This is a junior/entry-level role, and
we expect you to be eager to learn and grow.

Requirements:
- Basic experience with JavaScript, HTML, and CSS
- Some exposure to React or similar framework
`;

    const result = await extractor.extract(jd);

    expect(result.seniority).toBe("junior");
  });

  it("classifies a mid role as 'mid' when the title says mid, even if the body mentions senior", async () => {
    const jd = `
Mid Full-Stack JavaScript / Web3 Engineer (React/Next.js, Node.js)

We are hiring a Senior Full-Stack Engineer to join our core product team. You will
design and build modern frontend experiences in React/Next.js and scalable Node.js APIs,
with a strong focus on performance, security, and developer experience.

You will collaborate with product, design, and DevOps, and occasionally mentor junior
developers.

Requirements:
- Experience with React, Next.js, Node.js
`;

    const result = await extractor.extract(jd);

    expect(result.seniority).toBe("mid");
  });

  it("returns 'unknown' when no level hints are present", async () => {
    const jd = `
Full-Stack Engineer

You will work on both frontend and backend parts of our platform, collaborating closely
with design, product, and QA. We care about clean code, tests, and good communication,
but we don't assign strict seniority titles in our job descriptions.

Requirements:
- Experience with TypeScript, React, and Node.js
`;

    const result = await extractor.extract(jd);

    expect(result.seniority).toBe("unknown");
  });
});