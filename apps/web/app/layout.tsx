import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://craftia.com.mx"),
  title: {
    default: "Craftia — Software & AI Solutions",
    template: "%s | Craftia",
  },
  description:
    "We build SaaS products and AI-powered software solutions. Custom development from concept to production.",
  keywords: [
    "software development",
    "SaaS",
    "AI solutions",
    "web development",
    "custom software",
    "artificial intelligence",
  ],
  authors: [{ name: "Alvaro Sepulveda" }],
  creator: "Craftia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://craftia.com.mx",
    siteName: "Craftia",
    title: "Craftia — Software & AI Solutions",
    description: "We build SaaS products and AI-powered software solutions.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Craftia" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Craftia — Software & AI Solutions",
    description: "We build SaaS products and AI-powered software solutions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <JsonLd />
        <Header />
        {children}
      </body>
    </html>
  );
}
