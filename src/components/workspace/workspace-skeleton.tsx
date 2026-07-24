import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-label={label} className="space-y-6">
      <header className="border-b border-border pb-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-10 w-full max-w-2xl" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      </header>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
        <div className="border border-border bg-surface p-5 md:p-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-7 w-2/3" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-20 w-full" />)}
          </div>
        </div>
        <div className="border border-border bg-surface p-5 md:p-6">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-3/4" />
          <Skeleton className="mt-6 h-32 w-full" />
          <Skeleton className="mt-3 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
