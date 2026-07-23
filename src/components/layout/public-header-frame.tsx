"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PublicHeaderFrame({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 20);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-site-header
      data-scrolled={scrolled}
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-white/10 bg-[#111312]/94 shadow-[0_12px_36px_rgba(0,0,0,.26)] backdrop-blur-xl"
          : "border-transparent bg-[#101211]/92 backdrop-blur-md",
      )}
    >
      {children}
    </header>
  );
}
