import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="RRS home">
      <span className="relative size-8 overflow-hidden rounded-[7px] bg-black">
        <Image src="/rrs-mark.png" alt="" fill sizes="32px" priority className="object-cover object-center" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[17px] font-extrabold tracking-[-0.03em]">RRS</span>
        <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[.16em] text-secondary sm:block">Web & Product Studio</span>
      </span>
    </Link>
  );
}
