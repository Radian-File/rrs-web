import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[10px] border border-border-strong bg-surface px-4 text-sm text-foreground caret-accent-lime outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-muted file:mr-3 file:cursor-pointer file:rounded-[8px] file:border-0 file:bg-accent-soft file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-surface-hover focus:border-primary focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-error aria-invalid:bg-error-soft/30 aria-invalid:focus-visible:ring-error/30 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-muted disabled:opacity-70 read-only:cursor-default read-only:bg-background/60 read-only:text-secondary",
        className,
      )}
      {...props}
    />
  );
}
