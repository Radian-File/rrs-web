import { Skeleton } from "@/components/ui/skeleton";

export function ConversionFrameSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-label={label} data-composition="conversion-frame-skeleton">
      <div className="h-[73px] border-b border-border bg-background px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <section className="relative isolate overflow-hidden border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-5 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12">
          <Skeleton className="h-24 w-full rounded-none border border-border" />

          <div className="grid gap-5 border-b border-border py-8 md:py-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:gap-12">
            <div className="space-y-4">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-16 w-full max-w-2xl sm:h-20" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="grid gap-6 pt-6 md:gap-8 md:pt-8 lg:grid-cols-[minmax(15rem,19rem)_minmax(0,1fr)] lg:items-start xl:grid-cols-[20rem_minmax(0,1fr)]">
            <div className="order-2 space-y-4 border border-border bg-surface/55 p-5 lg:order-1">
              <Skeleton className="h-3 w-28" />
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="order-1 min-w-0 border border-border-strong bg-surface p-5 sm:p-6 md:p-8 lg:order-2 lg:p-10">
              <div className="flex gap-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="h-10 flex-1" />
                ))}
              </div>
              <Skeleton className="mt-8 h-8 w-2/3" />
              <Skeleton className="mt-3 h-4 w-full max-w-xl" />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full sm:col-span-2" />
              </div>
              <div className="mt-8 flex justify-between gap-4 border-t border-border pt-6">
                <Skeleton className="h-12 w-28" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
