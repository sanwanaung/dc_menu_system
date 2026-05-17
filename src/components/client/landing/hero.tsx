import Image from "next/image";
import { ArrowDown, ConciergeBell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroProps = {
  onMenu: () => void;
  onRoomService: () => void;
};

// hero -> https://diamond-crown.yangonhotels.org/data/Imgs/1920x1080w/17223/1722333/1722333313/img-diamond-crown-hotel-yangon-17.JPEG

export function Hero({ onMenu, onRoomService }: HeroProps) {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden">
      <Image
        src="https://images.openai.com/static-rsc-4/xmi-OsVoknzeG5Hwo2D3Lrpj8gv6knLO7ltPl6SQxNdaGNykdqpr3JFywiO-zWiIjLqGyDxXsGeCifB2SipqNcWtwZYj--qmo9c-e0wawYnSyngDykEQp5PJanGcWpa0dVDaD5amrRr4_tZEhbxSMjHl06okEvxLfh8QxpLN4n-shFkiH8znXwNtuZP_0Ph3?purpose=fullsize"
        alt="Skyline Hub Hotel - Bankkok, Thailand"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/45 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.10),transparent_55%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-20 pb-16 text-center text-white sm:px-6 lg:px-8">
        <p className="text-xs font-medium tracking-[0.32em] text-white/80 uppercase">
          Skyline Hub Hotel • Bankok, Thailand
        </p>

        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Experience Comfort &amp; Luxury
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
          Premium rooms, delicious dining, and modern hospitality.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-11 rounded-2xl bg-amber-200/90 px-6 text-black hover:bg-amber-200"
            onClick={onMenu}
          >
            View Menu
            <ArrowDown className="ml-2 size-4 opacity-80" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={cn(
              "h-11 rounded-2xl border-white/20 bg-white/10 px-6 text-white backdrop-blur-md",
              "hover:bg-white/15 hover:text-white",
            )}
            onClick={onRoomService}
          >
            <ConciergeBell className="mr-2 size-4" />
            Request Room Service
          </Button>
        </div>

        <p className="mt-7 text-xs text-white/55">
          Seamless digital menu &amp; effortless in-room service.
        </p>
      </div>
    </section>
  );
}
