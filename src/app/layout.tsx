import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getLocale } from "@/i18n/server";
import { MotionProvider } from "@/components/motion-provider";
import { SkipLink } from "@/components/layout/skip-link";
import { getServerAppUrl } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getServerAppUrl()),
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
}

export const viewport: Viewport = {
  themeColor: "#0d100e",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${inter.variable} ${archivo.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <MotionProvider>
          <SkipLink label={locale === "id" ? "Lewati ke konten" : "Skip to content"} />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <Toaster richColors theme="dark" position="top-right" />
        </MotionProvider>
      </body>
    </html>
  );
}
