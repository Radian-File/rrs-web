import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConversionStepper({
  currentStep,
  label,
  statusLabels,
  steps,
}: {
  currentStep: number;
  label: string;
  statusLabels: { complete: string; current: string; upcoming: string };
  steps: string[];
}) {
  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {`${currentStep} / ${steps.length}: ${steps[currentStep - 1]}`}
      </p>
      <ol aria-label={label} className="grid grid-cols-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li
              key={step}
              aria-current={isCurrent ? "step" : undefined}
              className="relative flex min-w-0 flex-col items-center text-center"
            >
              {index > 0 ? (
                <span
                  className={cn(
                    "absolute right-1/2 top-4 -z-0 h-px w-full",
                    isComplete || isCurrent ? "bg-primary" : "bg-border-strong/70",
                  )}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 grid size-8 place-items-center rounded-full border text-[11px] font-bold transition-colors",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-accent-lime bg-accent-lime text-background shadow-[0_0_0_4px_rgba(200,237,115,0.1)]",
                  !isComplete && !isCurrent && "border-border-strong bg-surface-container text-secondary",
                )}
                aria-hidden="true"
              >
                {isComplete ? <Check className="size-4" strokeWidth={2.5} /> : stepNumber}
              </span>
              <span
                className={cn(
                  "mt-2 max-w-full truncate px-1 text-[10px] font-bold uppercase tracking-[.1em] sm:text-xs sm:tracking-[.12em]",
                  isCurrent ? "text-foreground" : isComplete ? "text-primary" : "text-muted",
                )}
              >
                {step}
              </span>
              <span className="sr-only">
                {` — ${isComplete ? statusLabels.complete : isCurrent ? statusLabels.current : statusLabels.upcoming}`}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
