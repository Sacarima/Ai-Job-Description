"use client";

import { X } from "lucide-react";

interface JdSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const HOW_IT_WORKS_ITEMS: string[] = [
  "Paste any job description to analyze its title, level, skills, and salary.",
  "If an AI key is configured, the app calls the model to build a structured JSON skill matrix.",
  "If AI is unavailable, a deterministic fallback parser still returns the same JSON shape.",
];

const INFO_TEXT =
  "Both AI and fallback paths share the same Zod-validated JSON shape. You can safely copy the result into your own tools, spreadsheets, or pipelines without changing anything when you switch AI on or off.";

export function JdSidebar({ mobileOpen, setMobileOpen }: JdSidebarProps) {
  const closeMobile = () => setMobileOpen(false);
  const titleId = "jd-skill-matrix-title";
  const currentYear = new Date().getFullYear();

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
                Description
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
                {HOW_IT_WORKS_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
              <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
                {INFO_TEXT}
              </p>
            </div>
          </section>

          <footer className="px-4 py-3 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
            <span>v1.0</span>
            <span className="opacity-80">© {currentYear}</span>
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
                Description
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
              {HOW_IT_WORKS_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
            <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
              {INFO_TEXT}
            </p>
          </div>
        </nav>
      </aside>
    </>
  );
}
