"use client";

import { X } from "lucide-react";

interface JdSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function JdSidebar({ mobileOpen, setMobileOpen }: JdSidebarProps) {
  const closeMobile = () => setMobileOpen(false);

  const titleId = "jd-skill-matrix-title";

  return (
    <>
      <aside
        className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card/40 text-foreground"
        aria-labelledby={titleId}
        role="complementary"
      >
        <div className="flex h-full w-full flex-col overflow-y-auto">
          <div className="h-1 w-full bg-gradient-custom" aria-hidden="true" />

          <header className="flex items-center gap-2 px-4 py-4 border-b border-border/80">
            <div
              className="h-9 w-9 rounded-lg bg-gradient-custom grid place-items-center font-bold text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              Jb
            </div>
            <div className="leading-tight">
              <h1 id={titleId} className="text-sm font-semibold">
                Job description helper
              </h1>
            </div>
          </header>

          <section
            aria-label="Tool description"
            className="flex-1 px-4 py-4 text-xs text-muted-foreground space-y-4"
          >
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                How it works
              </h2>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Paste any job description on the right.</li>
                <li>
                  The app turns it into a structured skill matrix (title, level, skills, salary).
                </li>
                <li>
                  If an AI key is set, it uses AI first and falls back to a safe parser if needed.
                </li>
              </ul>
            </div>

            <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
              <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
                Without an AI key, a simple rule-based parser still gives you a clean JSON summary.
                With AI enabled, you get a smarter analysis, but the output format stays the same, so
                it&apos;s easy to reuse in scripts, dashboards, or other tools.
              </p>
            </div>
          </section>

          <footer className="px-4 py-3 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
            <span>v1.0</span>
            <span className="opacity-80">© {new Date().getFullYear()}</span>
          </footer>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] bg-popover text-foreground border-r border-border shadow-lg transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${titleId}-mobile`}
      >
        <header className="flex items-center justify-between px-3 py-3 bg-popover/90 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg bg-gradient-custom grid place-items-center font-bold text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              JD
            </div>
            <div className="leading-tight">
              <h1 id={`${titleId}-mobile`} className="text-sm font-semibold">
                AI Job Description Skill Matrix
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={closeMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-card hover:bg-card/90 ring-1 ring-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
            aria-label="Close navigation panel"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <nav
          className="px-4 py-4 text-xs text-muted-foreground space-y-3"
          aria-label="Tool information"
        >
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
              How it works
            </h2>
            <ul className="mt-2 space-y-1.5 list-disc list-inside">
              <li>Paste a job description to analyze its skills and level.</li>
              <li>
                With an AI key, the app asks the model for a structured JSON skill matrix.
              </li>
              <li>
                If AI is unavailable, a fallback parser still produces a consistent JSON result.
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
            <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
              Both AI and fallback paths use the same JSON shape. That means you can confidently
              copy the result into your own tools, spreadsheets, or pipelines without changing
              anything when you switch AI on or off.
            </p>
          </div>
        </nav>
      </aside>
    </>
  );
}
