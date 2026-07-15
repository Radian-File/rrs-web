import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-32 w-full resize-y rounded-[12px] border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60", className)}
      {...props}
    />
  );
}
