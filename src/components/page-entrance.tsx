"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useMotionEnabled } from "@/components/motion-provider";

type EntrancePhase = "idle" | "from" | "visible";

export function PageEntrance({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const motionEnabled = useMotionEnabled();
  const [phase, setPhase] = useState<EntrancePhase>("idle");
  const frames = useRef<number[]>([]);

  useLayoutEffect(() => {
    frames.current.forEach(cancelAnimationFrame);
    const initial = requestAnimationFrame(() => {
      if (!motionEnabled) {
        setPhase("idle");
        return;
      }
      setPhase("from");
      const first = requestAnimationFrame(() => {
        const second = requestAnimationFrame(() => setPhase("visible"));
        frames.current = [second];
      });
      frames.current = [first];
    });
    frames.current = [initial];
    return () => frames.current.forEach(cancelAnimationFrame);
  }, [motionEnabled, pathname]);

  return <div key={pathname} data-page-enter={phase} className={className}>{children}</div>;
}
