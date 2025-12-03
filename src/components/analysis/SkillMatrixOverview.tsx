import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

type Props = {
  result: SkillMatrix;
};

const SENIORITY_LABEL: Record<SkillMatrix["seniority"], string> = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
  unknown: "Unspecified",
};

const SENIORITY_TONE: Record<SkillMatrix["seniority"], string> = {
  junior: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  mid: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  senior: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  lead: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  unknown: "bg-muted text-muted-foreground border-border",
};

function SeniorityBadge({ seniority }: { seniority: SkillMatrix["seniority"] }) {
  const label = SENIORITY_LABEL[seniority];
  const tone = SENIORITY_TONE[seniority];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function SkillChipsRow({ label, skills }: { label: string; skills: string[] }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] text-foreground/80"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillMatrixOverview({ result }: Props) {
  const { title, seniority, skills, mustHave, niceToHave } = result;

  const hasMustHave = mustHave && mustHave.length > 0;
  const hasNiceToHave = niceToHave && niceToHave.length > 0;

  return (
    <div className="mb-4 rounded-md border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground">Title</p>
          <p className="text-sm font-medium text-foreground/90">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          <SeniorityBadge seniority={seniority} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <SkillChipsRow label="Frontend" skills={skills.frontend} />
        <SkillChipsRow label="Backend" skills={skills.backend} />
        <SkillChipsRow label="DevOps" skills={skills.devops} />
        <SkillChipsRow label="Web3 / EVM" skills={skills.web3} />
        <SkillChipsRow label="Other" skills={skills.other} />
      </div>

      {(hasMustHave || hasNiceToHave) && (
        <div className="grid gap-3 md:grid-cols-2">
          {hasMustHave && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Must have
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-[11px] text-muted-foreground">
                {mustHave.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {hasNiceToHave && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Nice to have
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-[11px] text-muted-foreground">
                {niceToHave.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
