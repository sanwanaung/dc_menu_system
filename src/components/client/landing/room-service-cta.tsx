import Image from "next/image";
import { ConciergeBell, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoomServiceCtaProps = {
  onRequest: () => void;
};

export function RoomServiceCta({ onRequest }: RoomServiceCtaProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.openai.com/static-rsc-4/4nrt8qIe1pljibNWmv3Sgdzlw7Q-aS_9j7yObcQ0qGeXyRM_Zu4n65F1Wjp3mkYcd0fV9rFD_HYwIGAoKr_rHrDNrYcxkTvepjXnRx4MoIy_qUHGIBu6VS_1ouFEUYevOmHeHSgZhIIYUiNF195ynC6kxSBqrT6w_LDjhuMJMIhD-tPDRxlVIwNrkfUjmN2n?purpose=fullsize"
          // "https://diamond-crown.yangonhotels.org/data/Imgs/1920x1080w/3183/318334/318334969/img-diamond-crown-hotel-yangon-33.JPEG"
          alt="Dining at Diamond Crown Hotel"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-8 text-center text-white shadow-xl",
            "supports-[backdrop-filter]:backdrop-blur-md",
          )}
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs tracking-[0.24em] uppercase ring-1 ring-white/15">
            <Sparkles className="size-4 text-amber-200/90" />
            Effortless Service
          </div>
          <h3 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Enjoy 24/7 In‑Room Dining Service
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
            From comforting classics to chef specials — your order arrives
            beautifully plated, right to your room.
          </p>

          <div className="mt-7 flex justify-center">
            <Button
              size="lg"
              className="h-11 rounded-2xl bg-amber-200/90 px-6 text-black hover:bg-amber-200"
              onClick={onRequest}
            >
              <ConciergeBell className="mr-2 size-4" />
              Request Room Service
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
