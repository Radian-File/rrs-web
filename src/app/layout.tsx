import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";
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
    default: "RRS Freelancer — Digital Projects with a Clearer Process",
    template: "%s | RRS Freelancer",
  },
  description: "Professional web development and UI/UX services with clear quotations, transparent project progress, and structured delivery.",
  applicationName: "RRS Freelancer",
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "RRS Freelancer",
    description: "From project brief to final delivery, managed through one clear workflow.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F6F2",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
