import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { getLocale } from "@/i18n/server";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "RRS Studio — Web & Product Projects with Clear Scope",
    template: "%s | RRS Studio",
  },
  description: "Independent web and product studio with clear quotations, transparent project progress, and structured delivery.",
  applicationName: "RRS Studio",
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "RRS Studio",
    description: "From project brief to final delivery, managed through one transparent workflow.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F6F2",
  colorScheme: "light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <MotionProvider>
          <a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] rounded-[8px] bg-primary px-4 py-2 text-sm font-semibold text-white focus:not-sr-only">{locale === "id" ? "Lewati ke konten" : "Skip to content"}</a>
          <div id="main-content" tabIndex={-1}>{children}</div>
          <Toaster richColors position="top-right" />
        </MotionProvider>
      </body>
    </html>
  );
}
