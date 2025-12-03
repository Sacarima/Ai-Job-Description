# AI Job Description  Skill Matrix

A tiny developer-facing tool that takes a **job description (JD)**, runs it through an **LLM-powered extractor** (with a deterministic fallback), and returns a structured **skill matrix + summary** you can copy the json as needed.

![App preview](/preview.png)

1-  Works **with or without** an OpenAI API key  
2-  Strongly typed with **Zod** + TypeScript  
3-  Clean UI built with **Next.js App Router + Tailwind**  
4-  Fallback parser (regex + keyword maps) so you always get a result

---

## Features

- Paste any job description into a textarea and click **Analyze**.
- See a **pretty-printed JSON** result with the following shape:

  ```ts
  {
    title: string;
    seniority: "junior" | "mid" | "senior" | "lead" | "unknown";
    skills: {
      frontend: string[];
      backend: string[];
      devops: string[];
      web3: string[]; 
      other: string[];
    };
    mustHave: string[];
    niceToHave: string[];
    salary?: {
      currency: "USD" | "EUR" | "PLN" | "GBP";
      min?: number;
      max?: number;
    };
    summary: string; // ≤ 60 words limit
  }
