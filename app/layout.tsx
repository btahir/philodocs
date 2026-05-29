import type { Metadata } from "next";
import { Geist, Geist_Mono, Literata } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

const description =
  "Open-source notes for the history of thought: a clear philosophy wiki, timeline, and relationship graph for thinkers, schools, works, and ideas.";
const siteUrl = "https://philodocs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PhiloDocs",
    template: "%s | PhiloDocs",
  },
  applicationName: "PhiloDocs",
  description,
  openGraph: {
    title: "PhiloDocs",
    description,
    siteName: "PhiloDocs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhiloDocs",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
