import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MenuItem = {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Crispy Fried Chicken",
    price: "$12",
    description:
      "Golden crispy chicken served with seasoned fries and signature dipping sauce.",
    imageUrl:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Grilled Beef Steak",
    price: "$18",
    description:
      "Juicy grilled beef steak with roasted vegetables and black pepper sauce.",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Creamy Seafood Pasta",
    price: "$14",
    description:
      "Rich creamy pasta with shrimp, squid, herbs, and parmesan cheese.",
    imageUrl:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Classic Hotel Breakfast",
    price: "$10",
    description:
      "Fresh croissant, eggs, seasonal fruits, sausages, and hot coffee.",
    imageUrl:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  },
];

export function MenuPreview() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {MENU_ITEMS.map((item) => (
        <Card
          key={item.name}
          className={cn(
            "overflow-hidden rounded-3xl bg-white/60 ring-1 ring-foreground/10",
            "supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:backdrop-blur-md",
            "transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg",
          )}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
          </div>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {/* <p className="shrink-0 rounded-2xl bg-amber-200/40 px-3 py-1 text-sm font-medium text-foreground ring-1 ring-amber-300/40">
                {item.price}
              </p> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
