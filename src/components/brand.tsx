import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return <Link href="/" className={cn("inline-flex items-center", className)} aria-label="RRS Studio home">
    <span className="relative hidden h-9 w-[180px] sm:block">
      <Image src="/rrs-studio-lockup.png" alt="RRS Studio — Web & Product Studio" fill sizes="180px" priority className="object-contain object-left mix-blend-multiply" />
    </span>
    <span className="relative size-9 sm:hidden">
      <Image src="/rrs-studio-mark.png" alt="RRS Studio" fill sizes="36px" priority className="object-contain mix-blend-multiply" />
    </span>
  </Link>;
}
