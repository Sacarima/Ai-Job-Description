import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

type Skills = SkillMatrix["skills"];
type BucketName = keyof Skills;

interface SkillDef {
  label: string;        
  bucket: BucketName;   
  patterns: RegExp[];  
}


const SKILL_DEFS: SkillDef[] = [
 
  {
    label: "JavaScript",
    bucket: "frontend",
    patterns: [/\bjavascript\b/i, /\bjs\b/i],
  },
  {
    label: "TypeScript",
    bucket: "frontend",
    patterns: [/\btypescript\b/i, /\bts\b/i],
  },
  {
    label: "React",
    bucket: "frontend",
    patterns: [/\breact(\.js)?\b/i],
  },
  {
    label: "Next.js",
    bucket: "frontend",
    patterns: [/\bnext\.js\b/i],
  },
  {
    label: "CSS",
    bucket: "frontend",
    patterns: [/\bcss\b/i],
  },
  {
    label: "HTML",
    bucket: "frontend",
    patterns: [/\bhtml\b/i],
  },
  {
    label: "Redux",
    bucket: "frontend",
    patterns: [/\bredux\b/i],
  },
  {
    label: "Vue",
    bucket: "frontend",
    patterns: [/\bvue(\.js)?\b/i],
  },
  {
    label: "Angular",
    bucket: "frontend",
    patterns: [/\bangular\b/i],
  },

  {
    label: "Node.js",
    bucket: "backend",
    patterns: [/\bnode\.js\b/i, /\bnode\b/i],
  },
  {
    label: "Java",
    bucket: "backend",
    patterns: [/\bjava\b(?!script)/i],
  },
  {
    label: "Python",
    bucket: "backend",
    patterns: [/\bpython\b/i],
  },
  {
    label: "Go",
    bucket: "backend",
    patterns: [/\bgo(lang)?\b/i],
  },
  {
    label: "PostgreSQL",
    bucket: "backend",
    patterns: [/\bpostgres(ql)?\b/i],
  },
  {
    label: "MySQL",
    bucket: "backend",
    patterns: [/\bmysql\b/i],
  },
  {
    label: "MongoDB",
    bucket: "backend",
    patterns: [/\bmongodb\b/i],
  },

  
  {
    label: "Docker",
    bucket: "devops",
    patterns: [/\bdocker\b/i],
  },
  {
    label: "Kubernetes",
    bucket: "devops",
    patterns: [/\bkubernetes\b/i, /\bk8s\b/i],
  },
  {
    label: "Terraform",
    bucket: "devops",
    patterns: [/\bterraform\b/i],
  },
  {
    label: "AWS",
    bucket: "devops",
    patterns: [/\baws\b/i],
  },
  {
    label: "GCP",
    bucket: "devops",
    patterns: [/\bgcp\b/i],
  },
  {
    label: "Azure",
    bucket: "devops",
    patterns: [/\bazure\b/i],
  },
  {
    label: "CI/CD",
    bucket: "devops",
    patterns: [/\bci\/cd\b/i, /\bcontinuous integration\b/i],
  },

 
  {
    label: "Solidity",
    bucket: "web3",
    patterns: [/\bsolidity\b/i],
  },
  {
    label: "Ethers.js",
    bucket: "web3",
    patterns: [/\bethers\.js\b/i, /\bethers\b/i],
  },
  {
    label: "wagmi",
    bucket: "web3",
    patterns: [/\bwagmi\b/i],
  },
  {
    label: "viem",
    bucket: "web3",
    patterns: [/\bviem\b/i],
  },
  {
    label: "Merkle",
    bucket: "web3",
    patterns: [/\bmerkle\b/i],
  },
  {
    label: "Staking",
    bucket: "web3",
    patterns: [/\bstaking\b/i],
  },
  {
    label: "ERC-20",
    bucket: "web3",
    patterns: [/\berc-?20\b/i],
  },
  {
    label: "EVM",
    bucket: "web3",
    patterns: [/\bevm\b/i],
  },
  
  {
    label: "Agile",
    bucket: "other",
    patterns: [/\bagile\b/i],
  },
  {
    label: "Scrum",
    bucket: "other",
    patterns: [/\bscrum\b/i],
  },
  {
    label: "TDD",
    bucket: "other",
    patterns: [/\btdd\b/i],
  },
  {
    label: "BDD",
    bucket: "other",
    patterns: [/\bbdd\b/i],
  },
];

export function extractSkills(text: string): Skills {
  const skills: Record<BucketName, Set<string>> = {
    frontend: new Set(),
    backend: new Set(),
    devops: new Set(),
    web3: new Set(),
    other: new Set(),
  };

  for (const def of SKILL_DEFS) {
    if (def.patterns.some((re) => re.test(text))) {
      skills[def.bucket].add(def.label);
    }
  }

  return {
    frontend: Array.from(skills.frontend),
    backend: Array.from(skills.backend),
    devops: Array.from(skills.devops),
    web3: Array.from(skills.web3),
    other: Array.from(skills.other),
  };
}
