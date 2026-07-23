import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold leading-none tracking-[0.01em]",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-accent-soft text-primary",
        neutral: "border-border bg-surface-container text-secondary",
        success: "border-success/30 bg-success-soft text-success",
        warning: "border-warning/30 bg-warning-soft text-warning",
        error: "border-error/30 bg-error-soft text-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
