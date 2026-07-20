import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
