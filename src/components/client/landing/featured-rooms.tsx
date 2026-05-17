import Image from "next/image";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Room = {
  name: string;
  price: string;
  imageSrc: string;
  amenities: string[];
};

const ROOMS: Room[] = [
  {
    name: "Family Room",
    price: "",
    imageSrc:
      "https://images.openai.com/static-rsc-4/WprRW4VfapFJ27nIbCpeQvioQRFIxoncHW72vTwB_toeOkyqfiGWGiSTyDFdNJqIWPdrOnMrbsf_ij19rttgsgnH4no_vHKFCF5aGqTbjEICha-BVfXqOefJdcpYuIa1eTFv9_EfgBXQRJqsTZni61d9VzOfmIJxLxPInIAnXUlUDcSe3jZLVIlhGD4Gv-RK?purpose=fullsize",
    // "https://diamond-crown.yangonhotels.org/data/Imgs/1920x1080w/6827/682774/682774779/img-diamond-crown-hotel-yangon-68.JPEG",
    amenities: [
      "Only one Family Room available on each floor",
      "Spacious layout for families or groups",
      "Comfortable bedding with city atmosphere",
    ],
  },
  {
    name: "Superior Double Room",
    price: "",
    imageSrc:
      "https://images.openai.com/static-rsc-4/qTcydLQc7DpyGpyEh3Ce_Qeo9lnJj5n5OCqCDKwjBfnB81Xn3QfWnsXk0BXft7CLtScMG3SyatV98KbcTK812Q-2TRBu15DtFxexPbNV-LeE9pxzsBZfWX1cqsu24M3RwwZezQVGXZ7W8N2Vm5yY-soyiBwZOr7pcbLHUbLgesjvbNTKTjaBdKKK8dKJyEDi?purpose=fullsize",
    // "https://diamond-crown.yangonhotels.org/data/Imgs/1920x1080w/9090/909020/909020029/img-diamond-crown-hotel-yangon-31.JPEG",
    amenities: [
      "View of the nearby Idol Bar stage show",
      "Ideal for guests who enjoy nightlife vibes",
      "Comfortable double bed with modern interior",
    ],
  },
  {
    name: "Superior Twin Room",
    price: "",
    imageSrc:
      "https://images.openai.com/static-rsc-4/9LAqrVlVT5D5FVJbt_QWtjxGCLfwdLN3ZRfajNompZsEZbzgGfZJBJJJiaLVSqqKaXGsP7Qa_7MuqXAZ2kT2RE72GlbqL0c6jFBo5FnyYRjPfU6K4O9Me-SOGpoSS_I9WDZawBZ7JnVu9uK5GqR_gPArdlzqU4_AVowS28LGMaCCvgS6-R28mrCtE6Vk3boR?purpose=fullsize",
    // "https://diamond-crown.yangonhotels.org/data/Imgs/1920x1080w/9979/997918/997918326/img-diamond-crown-hotel-yangon-24.JPEG",
    amenities: [
      "Quieter atmosphere away from bar show noise",
      "Suitable for guests who prefer silence and rest",
      "Twin-bed setup with relaxing environment",
    ],
  },
];

export function FeaturedRooms() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {ROOMS.map((room) => (
        <Card
          key={room.name}
          className={cn(
            "overflow-hidden rounded-3xl bg-background",
            "ring-1 ring-foreground/10 shadow-sm",
            "transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg",
          )}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={room.imageSrc}
              alt={room.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
          </div>

          <CardHeader className="gap-1">
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{room.price}</p>
          </CardHeader>

          <CardContent className="space-y-2">
            <ul className="space-y-2">
              {room.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm">
                  <span className="inline-flex size-6 items-center justify-center rounded-xl bg-amber-200/40 ring-1 ring-amber-300/40">
                    <Sparkles className="size-3 text-foreground/80" />
                  </span>
                  <span className="text-foreground/90">{a}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          {/* <CardFooter className="bg-muted/30">
            <Button
              variant="outline"
              className="w-full rounded-2xl border-foreground/15 bg-background hover:bg-muted"
              type="button"
            >
              View Details
            </Button>
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
}
