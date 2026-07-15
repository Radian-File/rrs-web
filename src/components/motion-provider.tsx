"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MotionContext = createContext(false);

export function useMotionEnabled() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const next = !media.matches;
      root.classList.toggle("motion-ready", next);
      setEnabled(next);
    };
    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      root.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const observed = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        target.classList.add("is-visible");
        if (target.dataset.revealGroup !== undefined) {
          target.querySelectorAll<HTMLElement>("[data-reveal-item]").forEach((item, index) => {
            item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 350)}ms`);
          });
        }
        observer.unobserve(target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    const observeTarget = (target: HTMLElement) => {
      if (!observed.has(target)) { observed.add(target); observer.observe(target); }
    };
    const observeWithin = (node: ParentNode) => node.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]").forEach(observeTarget);
    observeWithin(document);
    const mutations = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches("[data-reveal], [data-reveal-group]")) observeTarget(node);
      observeWithin(node);
    })));
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [pathname, enabled]);

  return <MotionContext.Provider value={enabled}>{children}</MotionContext.Provider>;
}
