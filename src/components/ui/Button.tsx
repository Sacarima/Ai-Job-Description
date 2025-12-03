"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ className, children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md border border-border " +
    "bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm " +
    "transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      className={className ? `${base} ${className}` : base}
      {...props}
    >
      {children}
    </button>
  );
}
