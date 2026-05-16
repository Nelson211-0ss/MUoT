import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PortalHydrate } from "@/components/portal/PortalHydrate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MU Smart Portal Stack",
  description: "Enterprise campus portal scaffolding (Next.js + Laravel 11)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 transition-colors duration-150 dark:bg-zinc-950 dark:text-zinc-50">
        <PortalHydrate>{children}</PortalHydrate>
      </body>
    </html>
  );
}
