"use client";

import { useState } from "react";
import { JdSidebar } from "./JdSidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="theme-custom min-h-screen bg-background text-foreground font-sans">
      <JdSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 inline-flex h-10 w-10 items-center justify-center
                   rounded-lg border border-border bg-popover/90 text-foreground shadow-sm backdrop-blur"
        aria-label="Open navigation"
      >
        <span className="sr-only">Open menu</span>
        <span className="flex flex-col gap-[3px]">
          <span className="h-0.5 w-4 rounded bg-foreground" />
          <span className="h-0.5 w-4 rounded bg-foreground" />
          <span className="h-0.5 w-4 rounded bg-foreground" />
        </span>
      </button>

      <main className="pt-4 pb-6 lg:pl-64 lg:pr-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
