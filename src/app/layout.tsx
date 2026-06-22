import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skyline-hub-two.vercel.app"),

  title: {
    default: "Skyline Hub Hotel",
    template: "%s | Skyline Hub Hotel",
  },

  description:
    "Skyline Hub Hotel offers comfortable accommodation, digital dining, and convenient room service in Yangon.",

  applicationName: "Skyline Hub Hotel",

  keywords: [
    "Skyline Hub Hotel",
    "Hotel",
    "Yangon",
    "Myanmar",
    "Room Service",
    "Restaurant",
    "Digital Menu",
  ],

  authors: [
    {
      name: "Skyline Hub Hotel",
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Toaster position="bottom-right" />
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
