"use client";

import * as React from "react";
import Link from "next/link";
import { Diamond, Phone, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LandingHeaderProps = {
  onJump: (id: string) => void;
  onRoomService: () => void;
};

export function LandingHeader({ onJump, onRoomService }: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40",
        "transition duration-300",
        isScrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Skyline Hub Hotel"
          className="inline-flex items-center gap-2 text-white"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Diamond className="size-4 text-white/90" />
          </span>
          <span className="text-sm font-semibold tracking-wide">
            Skyline Hub Hotel
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button
            variant="ghost"
            className="text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => onJump("hotel")}
          >
            Hotel
          </Button>
          <Button
            variant="ghost"
            className="text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => onJump("rooms")}
          >
            Rooms
          </Button>
          <Button
            variant="ghost"
            className="text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => onJump("menu")}
          >
            Menu
          </Button>
          <Button
            variant="ghost"
            className="text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => onJump("room-service")}
          >
            Room Service
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/15 md:inline-flex"
            onClick={() => onJump("menu")}
          >
            <UtensilsCrossed className="mr-2 size-4" />
            View Menu
          </Button>
          <Button
            className="bg-amber-200/90 text-black hover:bg-amber-200"
            onClick={onRoomService}
          >
            <Phone className="mr-2 size-4" />
            Room Service
          </Button>
        </div>
      </div>
    </header>
  );
}
