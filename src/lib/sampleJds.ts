export type SampleJdKey = "senior_web3" | "fuzzy_fullstack" | "junior_frontend";

export interface SampleJd {
  key: SampleJdKey;
  label: string;
  description: string;
}

export const SAMPLE_JDS: SampleJd[] = [
  {
    key: "senior_web3",
    label: "Senior Full-Stack Web3",
    description: `Senior Full-Stack JavaScript / Web3 Engineer (React/Next.js, Node.js)

We are hiring a Senior Full-Stack Engineer to join our core product team. You will design and build modern frontend experiences in React/Next.js and scalable Node.js APIs, with a strong focus on performance, security, and developer experience.

Tech stack

Our current stack includes:
- Frontend: React, Next.js, TypeScript, JavaScript, HTML, CSS, Redux
- Backend: Node.js, Express, PostgreSQL, MongoDB
- DevOps: Docker, Kubernetes (K8s), Terraform, AWS, GitHub Actions for CI/CD
- Web3: Solidity, Ethers.js, wagmi, viem, ERC-20 tokens, EVM-based chains, Merkle proofs, staking contracts
- Practices: Agile, Scrum, TDD, BDD, code reviews, trunk-based development

Requirements
- 5+ years of experience as a JavaScript / TypeScript engineer
- Strong experience building SPAs with React and Next.js
- Solid knowledge of Node.js and REST/JSON APIs
- Hands-on experience with PostgreSQL or MongoDB
- Comfortable working with Docker and Kubernetes in production
- Experience setting up CI/CD pipelines (e.g. GitHub Actions)
- Professional experience with Solidity and EVM-based chains
- Ability to write clean, tested code (TDD/BDD mindset)
- Good understanding of Agile and Scrum processes
- Very good communication skills and ability to work in a cross-functional team

Nice to have
- Experience with other frontend frameworks (Vue or Angular)
- Knowledge of other backend languages (Go or Python)
- Familiarity with GCP or Azure in addition to AWS
- Experience designing tokenomics and staking mechanisms
- Experience optimizing smart contracts for gas costs
- Knowledge of security best practices in Web3 (reentrancy, access control, audits)

Compensation & benefits
- Salary range 90K–110K Euro gross per year
- Remote-friendly culture with flexible working hours
- Budget for conferences, courses, and certifications
- Modern equipment and tooling`,
  },
  {
    key: "fuzzy_fullstack",
    label: "Fuzzy Full-Stack (no headings)",
    description: `We’re looking for someone to help us modernize our stack and own a bunch of stuff across product, infra, and data.

You’ll be the go-to person for everything front to back: talking to users, scoping features with design, tweaking CSS when needed, and also getting your hands dirty with our APIs and pipelines.

We currently build things mostly in TypeScript and React, with a bit of Node and some Python scripts around. There’s some Terraform and Docker in the mix, plus whatever our current cloud vendor supports. We don’t have proper titles, but this is not an entry-level role; you’ll be expected to mentor others and make technical decisions.

Comp is competitive for the market; we can discuss ranges during the process.`,
  },
  {
    key: "junior_frontend",
    label: "Junior Frontend",
    description: `We are hiring a Junior Frontend Developer to join our product team.

You will work closely with senior engineers and designers to implement features in our web application, focusing on clean, accessible, and responsive UIs.

Requirements:
- 1–2 years of experience with JavaScript and modern frontend development
- Basic experience with React (or a similar framework)
- Good understanding of HTML, CSS, and responsive design
- Ability to work with REST/JSON APIs
- Willingness to learn and accept feedback

Nice to have:
- Some experience with TypeScript
- Familiarity with testing tools such as Jest or React Testing Library
- Experience with Tailwind CSS

We do not expect you to be an expert, but you should be curious, communicative, and motivated to grow.`,
  },
];
