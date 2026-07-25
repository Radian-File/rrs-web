import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className, compact = false }: { className?: string; compact?: boolean }) {
  return <Link href="/" className={cn("inline-flex items-center rounded-sm focus-visible:outline-offset-4", className)} aria-label="RRS Studio home">
    {compact ? <span className="relative size-10"><Image src="/rrs-studio-mark-transparent.png" alt="RRS Studio" fill sizes="40px" priority className="object-contain" /></span> : <>
      <span className="relative hidden h-9 w-[180px] sm:block"><Image src="/rrs-studio-lockup-transparent.png" alt="RRS Studio — Web & Product Studio" fill sizes="180px" priority className="object-contain object-left" /></span>
      <span className="relative size-9 sm:hidden"><Image src="/rrs-studio-mark-transparent.png" alt="RRS Studio" fill sizes="36px" priority className="object-contain" /></span>
    </>}
  </Link>;
}
