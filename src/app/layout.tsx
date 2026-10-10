import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "বাজার দর | BazarDor",
    template: "%s | বাজার দর",
  },
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর, মূল্য পরিবর্তন এবং বিভিন্ন পণ্যের দাম এক নজরে দেখুন।",
  applicationName: "বাজার দর",
  keywords: [
    "বাজার দর",
    "BazarDor",
    "বাংলাদেশের বাজার",
    "নিত্যপ্রয়োজনীয় পণ্যের দাম",
    "দৈনিক বাজারদর",
  ],
  openGraph: {
    title: "বাজার দর | BazarDor",
    description:
      "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর জানুন সহজেই।",
    siteName: "বাজার দর",
    locale: "bn_BD",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#183b2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-gray-900">
        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#183b2b",
              color: "#ffffff",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#a3e635",
                secondary: "#183b2b",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
