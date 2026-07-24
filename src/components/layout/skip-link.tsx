"use client";

export function SkipLink({ label }: { label: string }) {
  const skip = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector<HTMLElement>("main") ?? document.getElementById("main-content");
    if (!target) return;

    event.preventDefault();
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
  };

  return (
    <a
      href="#main-content"
      onClick={skip}
      className="sr-only fixed left-4 top-4 z-[100] min-h-11 items-center rounded-[10px] border border-accent-lime/50 bg-accent-lime px-4 py-2 text-sm font-semibold text-background shadow-xl focus:not-sr-only focus:flex"
    >
      {label}
    </a>
  );
}
