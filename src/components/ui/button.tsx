import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border text-sm font-semibold leading-none shadow-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:shadow-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-primary-hover bg-primary-strong text-primary-strong-foreground shadow-[0_8px_24px_rgba(0,0,0,0.22)] motion-safe:hover:-translate-y-px hover:border-primary hover:bg-primary-hover",
        secondary:
          "border-primary/25 bg-accent-soft text-primary hover:border-primary/45 hover:bg-surface-hover hover:text-foreground",
        outline:
          "border-border-strong bg-surface text-foreground hover:border-primary/60 hover:bg-surface-elevated",
        ghost:
          "border-transparent bg-transparent text-foreground shadow-none hover:border-border hover:bg-surface-container",
        danger:
          "border-error-hover bg-error-strong text-error-strong-foreground hover:border-error hover:bg-error-hover",
      },
      size: {
        sm: "min-h-11 px-4 py-2.5",
        md: "min-h-12 px-5 py-3",
        lg: "min-h-[52px] px-6 py-3.5 text-[15px]",
        icon: "size-11 shrink-0 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
