import Link from "next/link";
import { ArrowRight, LockKeyhole, MessageCircle, MessagesSquare } from "lucide-react";
import { ConversionFormPanel } from "@/components/conversion/conversion-frame";
import { ConversionNotice } from "@/components/conversion/conversion-notice";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/features/contact/contact-form";

export function ContactComposition({
  isId,
  whatsappNumber,
  whatsappUrl,
  projectHref,
  projectLabel,
  sent,
}: {
  isId: boolean;
  whatsappNumber: string;
  whatsappUrl: string;
  projectHref: string;
  projectLabel: string;
  sent: boolean;
}) {
  const copy = isId
    ? {
        eyebrow: "Contact / Guest discussion",
        title: "Mulai dari konteks, bukan asumsi.",
        description:
          "Diskusi awal tetap terbuka tanpa akun. Gunakan form untuk pertanyaan umum, WhatsApp untuk percakapan langsung, atau Client account untuk technical brief formal.",
        guest: "Jalur guest",
        guestTitle: "Diskusi tanpa komitmen",
        guestDescription: "WhatsApp dan Contact tidak membuat project, quotation, atau invoice secara otomatis.",
        whatsapp: "Diskusi melalui WhatsApp",
        formal: "Workflow formal",
        formalTitle: "Technical brief memerlukan Client login",
        formalDescription: "Identity, inquiry, quotation, agreement, project, dan finance tetap berada dalam ownership boundary akun.",
        formEyebrow: "Pertanyaan umum",
        formTitle: "Kirim konteks yang perlu dibahas.",
        formDescription: "Form ini tidak menggantikan technical brief dan tidak menetapkan scope atau harga final.",
        received: "Pesan diterima dan tersimpan.",
        receivedDescription: "Lanjutkan ke WhatsApp jika Anda ingin memulai diskusi lebih cepat. Reference contact sudah disertakan.",
        continueWhatsapp: "Lanjut ke WhatsApp",
        portal: "Sudah memiliki Client Portal?",
        signIn: "Masuk",
        or: "atau",
        create: "buat akun",
      }
    : {
        eyebrow: "Contact / Guest discussion",
        title: "Start with context, not assumptions.",
        description:
          "Initial discussion remains open without an account. Use the form for general questions, WhatsApp for direct conversation, or a Client account for the formal technical brief.",
        guest: "Guest path",
        guestTitle: "Discussion without commitment",
        guestDescription: "WhatsApp and Contact do not automatically create a project, quotation, or invoice.",
        whatsapp: "Discuss through WhatsApp",
        formal: "Formal workflow",
        formalTitle: "The technical brief requires Client sign-in",
        formalDescription: "Identity, inquiry, quotation, agreement, project, and finance remain inside the account ownership boundary.",
        formEyebrow: "General inquiry",
        formTitle: "Send the context that needs discussion.",
        formDescription: "This form does not replace the technical brief or define final scope and pricing.",
        received: "Your message has been received and stored.",
        receivedDescription: "Continue on WhatsApp if you would like to begin sooner. The contact reference is included.",
        continueWhatsapp: "Continue on WhatsApp",
        portal: "Already have a Client Portal?",
        signIn: "Sign in",
        or: "or",
        create: "create an account",
      };

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-border bg-[radial-gradient(circle_at_82%_20%,rgba(82,164,119,.12),transparent_30%),linear-gradient(180deg,#101411,#141815)]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 md:px-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-12 lg:py-24 xl:px-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-5xl font-display text-[clamp(3rem,6vw,6rem)] font-extrabold leading-[.9] tracking-[-.065em]">{copy.title}</h1>
          </div>
          <p className="max-w-xl text-base leading-8 text-secondary md:text-lg">{copy.description}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 md:px-8 lg:grid-cols-[minmax(16rem,.62fr)_minmax(0,1.38fr)] lg:items-start lg:px-12 lg:py-24 xl:px-16">
        <aside className="space-y-4">
          <section className="border border-border bg-surface p-5 md:p-6" aria-labelledby="contact-guest-title">
            <span className="grid size-10 place-items-center rounded-full border border-primary/25 bg-accent-soft text-primary">
              <MessagesSquare className="size-4" aria-hidden="true" />
            </span>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[.16em] text-primary">{copy.guest}</p>
            <h2 id="contact-guest-title" className="mt-2 font-display text-2xl font-extrabold tracking-[-.035em]">{copy.guestTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-secondary">{copy.guestDescription}</p>
            <p className="mt-6 font-display text-xl font-bold">{whatsappNumber}</p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={copy.whatsapp}>
                <MessageCircle className="size-4" aria-hidden="true" />
                {copy.whatsapp}
              </a>
            </Button>
          </section>

          <section className="border border-border bg-accent-soft/45 p-5 md:p-6" aria-labelledby="contact-formal-title">
            <LockKeyhole className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-primary">{copy.formal}</p>
            <h2 id="contact-formal-title" className="mt-2 font-display text-xl font-extrabold tracking-[-.025em]">{copy.formalTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-secondary">{copy.formalDescription}</p>
            <Link href={projectHref} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:text-accent-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              {projectLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        </aside>

        <ConversionFormPanel label={copy.formTitle}>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{copy.formEyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl">{copy.formTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary">{copy.formDescription}</p>

          {sent && (
            <div className="mt-7">
              <ConversionNotice title={copy.received} tone="success">
                <p>{copy.receivedDescription}</p>
                <Button asChild className="mt-4">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" aria-hidden="true" />
                    {copy.continueWhatsapp}
                  </a>
                </Button>
                <p className="mt-4 text-xs text-secondary">
                  {copy.portal}{" "}
                  <Link href="/login" className="font-semibold text-primary hover:underline">{copy.signIn}</Link>{" "}
                  {copy.or}{" "}
                  <Link href="/register" className="font-semibold text-primary hover:underline">{copy.create}</Link>.
                </p>
              </ConversionNotice>
            </div>
          )}

          <div className="mt-8">
            <ContactForm isId={isId} />
          </div>
        </ConversionFormPanel>
      </section>
    </main>
  );
}
