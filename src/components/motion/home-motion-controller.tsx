"use client";

import { useLayoutEffect, useRef } from "react";

export function HomeMotionController() {
  const marker = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;

    async function initialize() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const main = marker.current?.closest("main");
      if (!(main instanceof HTMLElement)) return;

      const context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          {
            desktop: "(min-width: 1024px)",
            compact: "(max-width: 1023px)",
            reduce: "(prefers-reduced-motion: reduce)",
          },
          ({ conditions }) => {
            const { desktop, reduce } = conditions as { desktop: boolean; compact: boolean; reduce: boolean };
            const hero = main.querySelector<HTMLElement>("[data-hero-motion]");
            if (!hero) return;

            const animated = main.querySelectorAll<HTMLElement>(
              "[data-hero-eyebrow], [data-hero-line], [data-motion-line], [data-hero-body], [data-hero-actions], [data-hero-detail], [data-hero-artifact], [data-scene-copy], [data-scene-visual], [data-feature-object], [data-process-step], [data-perspective-panel], [data-perspective-content]",
            );

            if (reduce) {
              gsap.set(animated, { clearProps: "all" });
              return;
            }

            const header = document.querySelector<HTMLElement>("[data-site-header]");
            const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
            if (header) entrance.from(header, { autoAlpha: 0, y: -12, duration: 0.55, clearProps: "all" }, 0);
            entrance
              .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 18, duration: 0.6 }, 0.12)
              .from("[data-hero-line]", { autoAlpha: 0, yPercent: 112, rotateX: 7, duration: 0.9, stagger: 0.1 }, 0.22)
              .from("[data-hero-body]", { autoAlpha: 0, y: 24, duration: 0.72 }, 0.5)
              .from("[data-hero-actions]", { autoAlpha: 0, y: 20, duration: 0.66 }, 0.62)
              .from("[data-hero-artifact]", { autoAlpha: 0, y: 48, scale: 0.94, rotate: (index) => [-2.5, 2.5, -1][index] ?? 0, duration: 0.85, stagger: 0.12 }, 0.72)
              .from("[data-hero-detail]", { autoAlpha: 0, y: 16, duration: 0.55 }, 1.04);

            const artifacts = gsap.utils.toArray<HTMLElement>("[data-hero-artifact]", hero);
            const floatConfig = [
              { y: 10, rotateZ: -1.2, duration: 8.2 },
              { y: -9, rotateZ: 1.1, duration: 10.1 },
              { y: 12, rotateZ: 0.7, duration: 7.4 },
            ];
            artifacts.forEach((artifact, index) => {
              const config = floatConfig[index] ?? floatConfig[0];
              gsap.to(artifact, { ...config, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.25 + index * 0.13 });
            });

            gsap.to("[data-hero-copy]", {
              y: desktop ? -58 : -24,
              autoAlpha: desktop ? 0.42 : 0.68,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: desktop ? 1 : 0.65 },
            });
            gsap.to("[data-hero-stage]", {
              y: desktop ? 56 : 22,
              scale: desktop ? 1.055 : 1.02,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: desktop ? 1 : 0.65 },
            });

            let removePointer: (() => void) | undefined;
            if (desktop && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
              const movers = artifacts.map((artifact, index) => ({
                x: gsap.quickTo(artifact, "x", { duration: 0.7, ease: "power3.out" }),
                rotateX: gsap.quickTo(artifact, "rotateX", { duration: 0.8, ease: "power3.out" }),
                rotateY: gsap.quickTo(artifact, "rotateY", { duration: 0.8, ease: "power3.out" }),
                depth: 0.55 + index * 0.24,
              }));
              const onPointerMove = (event: PointerEvent) => {
                const bounds = hero.getBoundingClientRect();
                const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
                const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
                movers.forEach((mover) => {
                  mover.x(nx * 18 * mover.depth);
                  mover.rotateX(-ny * 2 * mover.depth);
                  mover.rotateY(nx * 2 * mover.depth);
                });
              };
              const reset = () => movers.forEach((mover) => {
                mover.x(0);
                mover.rotateX(0);
                mover.rotateY(0);
              });
              hero.addEventListener("pointermove", onPointerMove, { passive: true });
              hero.addEventListener("pointerleave", reset);
              removePointer = () => {
                hero.removeEventListener("pointermove", onPointerMove);
                hero.removeEventListener("pointerleave", reset);
              };
            }

            const statement = main.querySelector<HTMLElement>("[data-statement-motion]");
            if (statement) {
              const statementLines = statement.querySelectorAll<HTMLElement>("[data-motion-line]");
              gsap.from(statementLines, { autoAlpha: 0, yPercent: 110, rotateX: 6, duration: 0.85, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: statement, start: "top 72%", once: true } });
            }

            main.querySelectorAll<HTMLElement>("[data-scroll-scene]").forEach((scene, index) => {
              const visual = scene.querySelector<HTMLElement>("[data-scene-visual]");
              const copy = scene.querySelectorAll<HTMLElement>("[data-scene-copy]");
              if (visual) {
                gsap.fromTo(
                  visual,
                  { autoAlpha: 0.45, y: desktop ? 90 : 36, scale: desktop ? 0.9 : 0.96, rotate: index % 2 === 0 ? -3 : 3 },
                  { autoAlpha: 1, y: 0, scale: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: scene, start: "top 88%", end: "center 54%", scrub: desktop ? 0.9 : 0.45 } },
                );
              }
              if (copy.length) {
                gsap.from(copy, { autoAlpha: 0, y: 28, stagger: 0.1, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: scene, start: "top 72%", once: true } });
              }
            });

            const featureStrip = main.querySelector<HTMLElement>("[data-feature-strip]");
            if (featureStrip) {
              const featureObjects = gsap.utils.toArray<HTMLElement>("[data-feature-object]", featureStrip);
              if (desktop) {
                featureObjects.forEach((object, index) => {
                  gsap.fromTo(
                    object,
                    { x: (index - (featureObjects.length - 1) / 2) * 38, y: index % 2 ? 84 : 42, rotate: (index % 2 ? 1 : -1) * (4 + index * 0.6), autoAlpha: 0.35 },
                    { x: 0, y: index % 2 ? 32 : 0, rotate: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: featureStrip, start: "top 88%", end: "center 56%", scrub: 0.8 } },
                  );
                });
              } else {
                gsap.from(featureObjects, { autoAlpha: 0, y: 24, stagger: 0.07, duration: 0.55, ease: "power2.out", scrollTrigger: { trigger: featureStrip, start: "top 78%", once: true } });
              }
            }

            const process = main.querySelector<HTMLElement>("[data-process-motion]");
            if (process) {
              const progress = process.querySelector<HTMLElement>("[data-process-progress]");
              if (progress) gsap.fromTo(progress, { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: process, start: "top 68%", end: "bottom 72%", scrub: 0.7 } });
              process.querySelectorAll<HTMLElement>("[data-process-step]").forEach((step) => {
                gsap.from(step, { autoAlpha: 0.45, x: desktop ? 24 : 12, duration: 0.55, ease: "power2.out", scrollTrigger: { trigger: step, start: "top 74%", toggleActions: "play none none reverse" } });
              });
            }

            const perspective = main.querySelector<HTMLElement>("[data-perspective-cta]");
            if (perspective) {
              const panel = perspective.querySelector<HTMLElement>("[data-perspective-panel]");
              const content = perspective.querySelector<HTMLElement>("[data-perspective-content]");
              if (panel) gsap.to(panel, { scale: desktop ? 0.94 : 0.98, rotateX: desktop ? 3.5 : 0, y: desktop ? -24 : -8, borderRadius: desktop ? 18 : 8, ease: "none", scrollTrigger: { trigger: perspective, start: "top 88%", end: "center 52%", scrub: 0.8 } });
              if (content) gsap.from(content, { autoAlpha: 0, y: desktop ? 70 : 28, scale: 0.98, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: perspective, start: "top 70%", once: true } });
            }

            return () => removePointer?.();
          },
        );
      }, main);

      dispose = () => context.revert();
      requestAnimationFrame(() => ScrollTrigger.refresh());
      void document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }

    void initialize();
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <span ref={marker} className="sr-only" aria-hidden="true" />;
}
