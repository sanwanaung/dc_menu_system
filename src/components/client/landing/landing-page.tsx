"use client";

import { LandingHeader } from "@/components/client/landing/landing-header";
import { Reveal } from "@/components/client/landing/reveal";
import { LandingSection } from "@/components/client/landing/section";
import { Hero } from "@/components/client/landing/hero";
import { HotelInfo } from "@/components/client/landing/hotel-info";
import { FeaturedRooms } from "@/components/client/landing/featured-rooms";
import { MenuPreview } from "@/components/client/landing/menu-preview";
import { RoomServiceCta } from "@/components/client/landing/room-service-cta";
import { LandingFooter } from "@/components/client/landing/footer";
import { RoomServiceDialog } from "@/components/client/landing/room-service-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingPage() {
  const [roomServiceOpen, setRoomServiceOpen] = useState(false);
  const router = useRouter();

  const veiewMenu = () => {
    router.push(
      "https://skyline-hub-two.vercel.app/menu?room=812&roomQR=QR-RN-812",
    );
  };

  const requestRoomService = () => {
    router.push(
      "https://skyline-hub-two.vercel.app/room-service?room=812&roomQR=QR-RN-812",
    );
  };

  return (
    <div className="bg-[#faf7f0] text-foreground">
      <LandingHeader
        onJump={(id) => jumpTo(id)}
        onRoomService={() => setRoomServiceOpen(true)}
        viewMenu={veiewMenu}
      />

      <RoomServiceDialog
        open={roomServiceOpen}
        onOpenChange={setRoomServiceOpen}
        veiewMenu={veiewMenu}
        requestRoomService={requestRoomService}
      />

      <Reveal className="animate-in fade-in-0 duration-700">
        <Hero
          onMenu={veiewMenu}
          onRoomService={() => setRoomServiceOpen(true)}
        />
      </Reveal>

      <div className="bg-[#faf7f0]">
        <LandingSection
          id="hotel"
          eyebrow="Skyline Hub Hotel"
          title="Quiet luxury, thoughtfully delivered"
          description="A calm, premium stay designed around comfort, service, and seamless in-room dining."
        >
          <Reveal delayMs={40}>
            <HotelInfo />
          </Reveal>
        </LandingSection>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-foreground/10" />
        </div>

        <LandingSection
          id="rooms"
          eyebrow="Featured Rooms"
          title="Rooms crafted for comfort"
          description="Elegant spaces with premium bedding, modern essentials, and a restful atmosphere."
        >
          <Reveal delayMs={60}>
            <FeaturedRooms />
          </Reveal>
        </LandingSection>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-foreground/10" />
        </div>

        <LandingSection
          id="menu"
          eyebrow="Dining"
          title="A curated menu preview"
          description="Chef-inspired favourites — beautiful presentation, warm flavours, and refined detail."
        >
          <Reveal delayMs={60}>
            <MenuPreview />
          </Reveal>
        </LandingSection>
      </div>

      <div id="room-service" className="scroll-mt-24">
        <Reveal>
          <RoomServiceCta onRequest={() => setRoomServiceOpen(true)} />
        </Reveal>
      </div>

      <LandingFooter />
    </div>
  );
}
