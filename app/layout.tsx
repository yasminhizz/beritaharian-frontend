import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/header";
import Footer from "@/components/footer";

import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oh My Netizen",
  description: "Latest news and updates",
  other: {
    "google-adsense-account": "ca-pub-6011530152705995",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        
        {/* title logo & menu) */}
        <Header />

        {/* content*/}
        <main className="flex-1">
          {children}
        </main>

        {/* footer */}
        <Footer />

      </body>
    </html>
  );
}