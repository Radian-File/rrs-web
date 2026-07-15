import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="RRS Freelancer home">
      <span className="grid size-9 place-items-center rounded-[10px] bg-primary text-sm font-extrabold text-white">R</span>
      <span className="font-display text-[17px] font-extrabold tracking-[-0.02em]">RRS Freelancer</span>
    </Link>
  );
}
