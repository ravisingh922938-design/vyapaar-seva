import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// 1. Modern Fonts Setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. High-Level SEO Metadata (Patna Hub)
export const metadata: Metadata = {
  title: "Vyapaar Seva - Patna's No. 1 Local Search Engine | vister.in",
  description: "Find the best Doctors, Plumbers, AC Repair, Schools, and Coachings in Patna. Get verified contact numbers and instant quotes on Vyapaar Seva.",
  keywords: [
    "Patna business directory",
    "AC repair Patna",
    "best coaching in Patna",
    "Bihar local search",
    "vister technologies",
    "local services Patna"
  ].join(", "),
  authors: [{ name: "Vister Technologies" }],
  openGraph: {
    title: "Vyapaar Seva - Har Patna Waasi Ka Sathi",
    description: "Verified Businesses in Patna - Get instant service quotes.",
    url: "https://vister.in",
    siteName: "Vyapaar Seva",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vyapaar Seva Patna",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 3. Razorpay Checkout Script - strategy="beforeInteractive" ensures it loads early */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}