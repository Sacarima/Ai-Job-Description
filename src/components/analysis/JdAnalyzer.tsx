"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useJdAnalysis } from "@/hooks/useJdAnalysis";
import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";
import { SAMPLE_JDS } from "@/lib/sampleJds";
import { SkillMatrixOverview } from "@/components/analysis/SkillMatrixOverview";
import { Copy } from "lucide-react";

function formatSalary(salary: NonNullable<SkillMatrix["salary"]>): string {
  const { currency, min, max } = salary;
  const format = (n?: number) => (typeof n === "number" ? n.toLocaleString("en-US") : undefined);

  if (min && max && min !== max) {
    return `${format(min)}–${format(max)} ${currency}`;
  }

  if (min) {
    return `${format(min)} ${currency}`;
  }

  return currency;
}

export function JdAnalyzer() {
  const { jd, setJd, analyze, result, error, isLoading, isStreaming, streamedSummary } =
    useJdAnalysis();

  const isDisabled = jd.trim().length === 0 || isLoading;

  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const helpTextId = "jd-help-text";
  const liveSummaryId = "jd-live-summary";
  const jsonOutputId = "jd-json-output";

  const resetCopyStateSoon = () => {
    window.setTimeout(() => setCopyState("idle"), 1500);
  };

  const handleUseSample = (description: string) => {
    setJd(description);
    setCopyState("idle");
  };

  const resultJson = useMemo(() => (result ? JSON.stringify(result, null, 2) : ""), [result]);

  const handleCopyJson = async () => {
    if (!resultJson) return;

    try {
      if (!navigator?.clipboard?.writeText) {
        setCopyState("error");
        resetCopyStateSoon();
        return;
      }

      await navigator.clipboard.writeText(resultJson);
      setCopyState("copied");
      resetCopyStateSoon();
    } catch {
      setCopyState("error");
      resetCopyStateSoon();
    }
  };

  const copyLabel =
    copyState === "copied" ? "Copied!" : copyState === "error" ? "Copy failed" : "Copy JSON";

  return (
    <section aria-label="Job description analyzer" className="space-y-8 mt-4 lg:mt-0">
      <section aria-labelledby="jd-input-title" className="space-y-2">
        <header className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h1 id="jd-input-title" className="text-2xl font-medium text-foreground">
            Job description
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
  <span className="text-sm font-medium text-muted-foreground w-full sm:w-auto">
    Sample job descriptions:
  </span>

  {SAMPLE_JDS.map((sample) => (
    <Button
      key={sample.key}
      type="button"
      onClick={() => handleUseSample(sample.description)}
      className="cursor-pointer rounded-full border border-border/70
                 bg-secondary/80 px-3 py-1 text-[11px] font-medium
                 text-secondary-foreground whitespace-nowrap
                 hover:bg-secondary hover:border-border
                 focus-visible:outline-none focus-visible:ring-2 
                 focus-visible:ring-ring focus-visible:ring-offset-2 
                 focus-visible:ring-offset-background transition-shadow"
    >
      {sample.label}
    </Button>
  ))}
</div>

        </header>

        <div className="space-y-2 pt-2">
    
          <Textarea
            id="jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Write or paste a job description here..."
            rows={10}
            aria-describedby={helpTextId}
            
          />

          <p id={helpTextId} className="text-xs text-muted-foreground">
            We&apos;ll extract title, seniority, skills, must-have / nice-to-have, salary hints and
            a short summary.
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <Button
            type="button"
            className="cursor-pointer inline-flex items-center gap-2"
            onClick={analyze}
            disabled={isDisabled}
            aria-busy={isLoading}
          >
            {isLoading && (
              <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden="true">
                <svg className="h-4 w-4 animate-spin text-foreground/70" viewBox="0 0 24 24">
                  <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-80"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                  />
                </svg>
              </span>
            )}
            <span className="text-white">{isLoading ? "Analyzing…" : "Analyze"}</span>
          </Button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-destructive" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
      </section>

      <section aria-labelledby="jd-result-title" className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="jd-result-title" className="text-sm font-semibold text-foreground">
            Result
          </h2>
          <p className="text-xs text-muted-foreground">
            The JSON structure is checked on the server to keep results consistent
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-custom"
            aria-hidden="true"
          />

          {!result && !error && !isLoading && (
            <p>
              No analysis yet. Paste a JD or use a sample and click{" "}
              <span className="font-medium text-card-foreground">Analyze</span> to see the skill
              matrix here.
            </p>
          )}

          {isLoading && !result && (
            <div className="space-y-3" role="status" aria-live="polite">
              <div className="h-3 w-32 rounded bg-muted animate-pulse" />
              <div className="h-4 w-full rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted/40 animate-pulse" />
              <span className="sr-only">Analyzing job description…</span>
            </div>
          )}

          {(isStreaming || streamedSummary) && (
            <div className="mb-3" aria-live="polite" aria-atomic="true">
              <p className="text-xs font-semibold text-foreground">Live AI summary</p>
              <p id={liveSummaryId} className="mt-1 min-h-6 text-sm text-muted-foreground">
                {streamedSummary || (
                  <span className="opacity-60">{isStreaming ? "Thinking…" : ""}</span>
                )}
              </p>
            </div>
          )}

          {result && (
            <div className="mt-2 space-y-3">
              <SkillMatrixOverview result={result} />

              <section aria-label="Summary and salary">
                <p className="text-xs font-semibold text-foreground">AI summary</p>
                <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>

                {result.salary && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Salary:</span>{" "}
                    {formatSalary(result.salary)}
                  </p>
                )}
              </section>
              <section aria-label="Raw skill matrix JSON" className="mt-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">Skill matrix (JSON)</p>

                  <Button
                    type="button"
                    onClick={handleCopyJson}
                    disabled={!result || copyState === "copied"}
                    className="cursor-pointer rounded-full border border-border bg-background px-3 py-1 text-xs text-white hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label="Copy skill matrix JSON to clipboard"
                  >
                    {copyState === "copied" ? "✓" : <Copy className="inline-block h-3 w-3 mr-1" aria-hidden="true" />}
                    {copyLabel}
                  </Button>
                </div>

                <pre
                  id={jsonOutputId}
                  className="font-mono max-h-72 overflow-auto rounded-md bg-background/60 p-3 text-xs text-muted-foreground"
                  aria-label="Skill matrix JSON output"
                >
                  {resultJson}
                </pre>
              </section>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
