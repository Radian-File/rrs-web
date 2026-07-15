import { cn } from "@/lib/utils";

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return <p id={id} role="alert" className="mt-2 text-xs font-medium text-error">{error}</p>;
}

export function fieldErrorClass(error?: string, className?: string) {
  return cn(className, error && "border-error focus:border-error focus:ring-error/15");
}
