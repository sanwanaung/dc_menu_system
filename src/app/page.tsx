import type { Metadata } from "next";

import { LandingPage } from "@/components/client/landing/landing-page";

export const metadata: Metadata = {
  title: "Skyline Hub Hotel — Digital Menu & Room Service",
  description:
    "Experience comfort & luxury in Yangon. View our menu, request room service, and explore rooms at Skyline Hub Hotel.",
};

export default async function Page() {
  return <LandingPage />;
}
