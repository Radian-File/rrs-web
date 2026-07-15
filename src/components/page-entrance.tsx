"use client";

import { usePathname } from "next/navigation";

export function PageEntrance({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  return <div key={pathname} data-page-enter className={className}>{children}</div>;
}
