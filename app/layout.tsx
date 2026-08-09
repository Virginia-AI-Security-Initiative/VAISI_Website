import type { Metadata } from "next";
import localFont from "next/font/local";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const neueHaas = localFont({
  src: [
    { path: "./fonts/NeueHaasDisplay-Light.woff2",  weight: "300", style: "normal" },
    { path: "./fonts/NeueHaasDisplay-Roman.woff2",  weight: "400", style: "normal" },
    { path: "./fonts/NeueHaasDisplay-Mediu.woff2",  weight: "500", style: "normal" },
    { path: "./fonts/NeueHaasDisplay-Bold.woff2",   weight: "700", style: "normal" },
    { path: "./fonts/NeueHaasDisplay-Black.woff2",  weight: "900", style: "normal" },
  ],
  variable: "--font-neue-haas",
});

export const metadata: Metadata = {
  title: "Virginia AI Security Initiative",
  description: "Official website for the Virginia AI Safety Initiative (VAISI) at the University of Virginia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={neueHaas.variable}>
      <body
        className="antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <MotionConfig reducedMotion="user">
          <SiteChrome>{children}</SiteChrome>
        </MotionConfig>
      </body>
    </html>
  );
}
