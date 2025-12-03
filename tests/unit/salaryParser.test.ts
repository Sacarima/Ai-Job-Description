import { describe, it, expect } from "vitest";
import { extractSalary } from "@/lib/parsing/salary";
import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

type Salary = NonNullable<SkillMatrix["salary"]>;

describe("extractSalary", () => {
  it("parses a Euro range like '90K–110K Euro' into min/max EUR", () => {
    const jd = `
Senior Full-Stack JavaScript / Web3 Engineer (React/Next.js, Node.js)

Compensation & benefits
- Salary range 90K–110K Euro gross per year
- Remote-friendly culture
`;

    const salary = extractSalary(jd) as Salary | null;

    expect(salary).not.toBeNull();
    expect(salary?.currency).toBe("EUR");
    expect(salary?.min).toBe(90000);
    expect(salary?.max).toBe(110000);
  });

  it("returns null/undefined when no salary is mentioned", () => {
    const jd = `
Full-Stack Engineer

We don't publish salary ranges in job descriptions. Compensation will be
discussed during the process.

Requirements:
- React, TypeScript, Node.js
`;

    const salary = extractSalary(jd);

    expect(salary).toBeFalsy();
  });
});
