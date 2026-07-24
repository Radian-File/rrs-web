import { CheckCircle2, CircleAlert, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConversionNotice({
  children,
  title,
  tone = "info",
}: {
  children?: React.ReactNode;
  title?: string;
  tone?: "info" | "success" | "error";
}) {
  const isError = tone === "error";
  const isSuccess = tone === "success";
  const Icon = isError ? CircleAlert : isSuccess ? CheckCircle2 : RotateCcw;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 border px-4 py-3",
        isError
          ? "border-error/35 bg-error-soft/70 text-error"
          : isSuccess
            ? "border-success/35 bg-success-soft/70 text-success"
            : "border-primary/30 bg-accent-soft/65 text-primary",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title ? <p className={cn("text-sm font-semibold", isError ? "text-error" : "text-foreground")}>{title}</p> : null}
        {children ? <div className={cn("text-sm leading-6", title && "mt-1", isError ? "text-error" : "text-secondary")}>{children}</div> : null}
      </div>
    </div>
  );
}
