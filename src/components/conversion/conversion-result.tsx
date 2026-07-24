export function ConversionResultFrame({
  icon,
  eyebrow,
  title,
  description,
  notice,
  primaryAction,
  meta,
  secondaryAction,
}: {
  icon: React.ReactNode;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  notice: React.ReactNode;
  primaryAction: React.ReactNode;
  meta?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}) {
  return (
    <main
      data-composition="conversion-result-frame"
      className="grid min-h-[70vh] place-items-center px-5 py-16"
    >
      <section
        className="w-full max-w-2xl border border-border bg-surface p-7 text-center md:p-12"
        aria-labelledby="conversion-result-title"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-success/30 bg-success-soft">
          {icon}
        </span>
        <p className="mt-7 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
          {eyebrow}
        </p>
        <h1
          id="conversion-result-title"
          className="mt-4 font-display text-3xl font-bold tracking-[-.04em] md:text-4xl"
        >
          {title}
        </h1>
        <div className="mx-auto mt-5 max-w-xl leading-7 text-secondary">
          {description}
        </div>
        <div className="mt-7 border-l-2 border-accent-lime bg-accent-soft p-5 text-left text-sm leading-6 text-secondary">
          {notice}
        </div>
        <div className="mt-8">{primaryAction}</div>
        {meta && <div className="mt-3 text-xs text-secondary">{meta}</div>}
        {secondaryAction && <div className="mt-3">{secondaryAction}</div>}
      </section>
    </main>
  );
}
