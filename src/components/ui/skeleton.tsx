import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-[10px] bg-surface-container", className)} />;
}

export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading content" className="mx-auto w-full max-w-[1280px] space-y-8 p-5 md:p-8">
      <div className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-10 w-full max-w-xl" /><Skeleton className="h-5 w-full max-w-2xl" /></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: cards }, (_, index) => <div key={index} className="rounded-[14px] border border-border bg-surface p-6"><Skeleton className="h-40 w-full" /><Skeleton className="mt-6 h-5 w-3/4" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /></div>)}</div>
    </div>
  );
}
