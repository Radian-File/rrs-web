"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("motion-ready");
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
      if (observed.has(target)) return;
      observed.add(target);
      if (target.dataset.pageEnter !== undefined) {
        requestAnimationFrame(() => target.classList.add("is-visible"));
        return;
      }
      observer.observe(target);
    };
    const observeWithin = (node: ParentNode) => node.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group], [data-page-enter]").forEach(observeTarget);
    observeWithin(document);
    const mutations = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches("[data-reveal], [data-reveal-group], [data-page-enter]")) observeTarget(node);
      observeWithin(node);
    })));
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [pathname]);

  useEffect(() => () => document.documentElement.classList.remove("motion-ready"), []);
  return null;
}
