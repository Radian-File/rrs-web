import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-[10px] border border-border-strong bg-surface px-4 py-3 text-sm leading-6 text-foreground caret-accent-lime outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-muted focus:border-primary focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-error aria-invalid:bg-error-soft/30 aria-invalid:focus-visible:ring-error/30 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-muted disabled:opacity-70 read-only:cursor-default read-only:bg-background/60 read-only:text-secondary",
        className,
      )}
      {...props}
    />
  );
}
