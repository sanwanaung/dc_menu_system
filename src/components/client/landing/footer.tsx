import Link from "next/link";
import { Diamond, MapPin, Phone } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#080808] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <Diamond className="size-4 text-white/90" />
              </span>
              <p className="text-sm font-semibold tracking-wide">
                Skyline Hub Hotel
              </p>
            </div>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              Luxury hospitality in Bankok — premium rooms, elegant dining, and
              effortless room service.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/75">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-white/60" />
              <p>
                145 ถนนสุขุมวิท, Bangkok 10110, <br /> Thailand
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-white/60" />
              <p>Front Desk: +66 2 345 6789</p>
            </div>
            <div className="flex items-center gap-4 text-white/70">
              <Link href="#" className="hover:text-white">
                Facebook
              </Link>
              <Link href="#" className="hover:text-white">
                Instagram
              </Link>
              <Link href="#" className="hover:text-white">
                X
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-white/10" />
        <div className="mt-6 flex flex-col gap-2 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Skyline Hub Hotel. All rights reserved.
          </p>
          <p>Crafted for calm, seamless hospitality.</p>
        </div>
      </div>
    </footer>
  );
}
