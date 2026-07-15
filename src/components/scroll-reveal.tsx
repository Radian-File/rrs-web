"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("motion-ready");
    const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); document.documentElement.classList.remove("motion-ready"); };
  }, []);
  return null;
}
