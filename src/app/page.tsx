import type { Metadata } from "next";

import { LandingPage } from "@/components/client/landing/landing-page";

export const metadata: Metadata = {
  title: "Digital Menu & Room Service",
  description:
    "Welcome to Skyline Hub Hotel. Browse our digital menu, order delicious meals, request room service, and enjoy a comfortable stay in Yangon.",

  keywords: [
    "Skyline Hub Hotel",
    "Hotel Yangon",
    "Hotel Myanmar",
    "Room Service",
    "Digital Menu",
    "Restaurant",
    "Food Ordering",
    "Hotel Dining",
    "Luxury Hotel",
  ],

  openGraph: {
    title: "Skyline Hub Hotel — Digital Menu & Room Service",
    description:
      "Browse our digital menu, order room service, and experience comfortable hospitality at Skyline Hub Hotel.",
    type: "website",
    locale: "en_US",
    siteName: "Skyline Hub Hotel",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Skyline Hub Hotel",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Skyline Hub Hotel — Digital Menu & Room Service",
    description:
      "Browse our digital menu and enjoy convenient room service at Skyline Hub Hotel.",
    images: ["/images/og-home.jpg"],
  },

  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  return <LandingPage />;
}
