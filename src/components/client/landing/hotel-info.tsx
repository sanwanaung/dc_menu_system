import * as React from "react";
import {
  Car,
  Clock,
  ConciergeBell,
  Hotel,
  ParkingSquare,
  ShowerHead,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
};

const FEATURES: Feature[] = [
  { icon: Clock, label: "Check-in", value: "12:00 PM" },
  { icon: ShowerHead, label: "Check-out", value: "12:00 PM" },
  { icon: Wifi, label: "Wi‑Fi", value: "Complimentary" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: ParkingSquare, label: "Parking" },
  { icon: ConciergeBell, label: "24/7 Service" },
  { icon: Hotel, label: "Downtown Yangon" },
];

export function HotelInfo() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="rounded-3xl bg-linear-to-b from-amber-100/60 to-background p-8 ring-1 ring-foreground/10">
          <p className="text-xs font-medium tracking-[0.28em] text-foreground/60 uppercase">
            Welcome
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">
            A refined stay in the heart of Yangon
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Skyline Hub Hotel blends warm hospitality with modern comfort —
            designed for calm mornings, effortless dining, and restful nights.
          </p>

          <div className="mt-6 rounded-2xl bg-background/70 p-4 ring-1 ring-foreground/10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-amber-200/50 ring-1 ring-amber-300/50">
                <Car className="size-4 text-foreground/80" />
              </span>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  145 ถนนสุขุมวิท, Bangkok 10110, Thailand
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card
              key={f.label}
              className={cn(
                "rounded-3xl bg-white/60 ring-1 ring-foreground/10",
                "supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:backdrop-blur-md",
                "transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg",
              )}
            >
              <CardContent className="flex items-center gap-3 pt-4">
                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-amber-200/40 ring-1 ring-amber-300/40">
                  <f.icon className="size-4 text-foreground/80" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none">{f.label}</p>
                  {f.value ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {f.value}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {f.label === "Swimming Pool"
                        ? "Unavailable"
                        : "Available"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
