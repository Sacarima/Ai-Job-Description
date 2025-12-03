"use client";

import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  const base =
    "block w-full rounded-md border border-input bg-card " +
    "px-5 py-2 text-sm text-card-foreground shadow-sm " +
    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 " +
    "focus:ring-ring focus:border-ring";

  return (
    <textarea
      className={className ? `${base} ${className}` : base}
      {...props}
    />
  );
}
