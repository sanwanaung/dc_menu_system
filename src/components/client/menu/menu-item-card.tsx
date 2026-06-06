import Image from "next/image";
import { Star, UtensilsCrossed } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { formatMoneyMMK } from "./format-money";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelectedMenuStore } from "@/hooks/client/use-selected-menu-store";

type MenuVariantImage = { id: string; url: string };

type MenuVariantOption = {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
  isAvailable: boolean;
};

type MenuVariantLink = {
  id: string;
  variantOption: MenuVariantOption;
  variantImage: MenuVariantImage[];
};

export type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  baseImage: string | null;
  imageType: "BASE_IMAGE" | "VARIANT_IMAGE";
  ratingAverage: number;
  ratingCount: number;
  variantLinks: MenuVariantLink[];
};

function getCoverImage(item: MenuItemData): string | null {
  if (item.imageType === "BASE_IMAGE") return item.baseImage ?? null;
  for (const link of item.variantLinks) {
    const url = link.variantImage?.[0]?.url;
    if (url) return url;
  }
  return item.baseImage ?? null;
}

function getPriceLabel(item: MenuItemData, selectedVariant?: string): string {
  if (item.imageType === "BASE_IMAGE") return formatMoneyMMK(item.price);
  // const variantPrices = item.variantLinks
  //   .map((l) => l.variantOption.price)
  //   .filter((p) => Number.isFinite(p));
  // if (variantPrices.length === 0) return formatMoneyMMK(item.price);
  // const min = Math.min(...variantPrices);
  // const max = Math.max(...variantPrices);
  const variantPrices = item.variantLinks.find(
    (item) => item.variantOption.name === selectedVariant,
  )?.variantOption.price;
  if (!variantPrices) return formatMoneyMMK(item.price);
  return `${formatMoneyMMK(item.price + variantPrices)}`;
}

function RatingPill({
  ratingAverage,
  ratingCount,
}: {
  ratingAverage: number;
  ratingCount: number;
}) {
  if (!ratingCount) return null;
  const ratingText = Number.isFinite(ratingAverage)
    ? ratingAverage.toFixed(1)
    : "0.0";

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur">
      <Star className="size-3 fill-white/90 text-white/90" />
      <span>{ratingText}</span>
      <span className="text-white/75">({ratingCount})</span>
    </div>
  );
}

export function MenuItemCard({
  item,
  categoryLabel,
}: {
  item: MenuItemData;
  categoryLabel?: string;
}) {
  const { addSelectedMenu, selectedMenu } = useSelectedMenuStore();
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const coverImage = getCoverImage(item);
  const priceLabel = getPriceLabel(item, selectedVariant);

  const variantCount =
    item.imageType === "VARIANT_IMAGE" ? item.variantLinks.length : 0;
  const variantPreviewNames =
    item.imageType === "VARIANT_IMAGE"
      ? item.variantLinks
          .slice(0, 3)
          .map((v) => v.variantOption.name)
          .filter(Boolean)
      : [];

  useEffect(() => {
    if (item.imageType === "VARIANT_IMAGE" && item.variantLinks.length > 0) {
      setSelectedVariant(item.variantLinks[0].variantOption.name);
    }
  }, [item]);

  const handleAddToCart = (selectedMenuData: MenuItemData) => {
    console.log("selectedMenuData: ", selectedMenuData);
    const selectedItem = selectedMenuData.variantLinks.filter(
      (selectedMenuData) =>
        selectedMenuData.variantOption.name === selectedVariant,
    );
    const newItem = {
      ...selectedMenuData,
      variantLinks: selectedItem,
      orderId: crypto.randomUUID(),
      quantity: 1,
    };
    addSelectedMenu(newItem);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-sm ring-1 border ring-foreground/10 shadow",
        "transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg",
      )}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-amber-200/40 ring-1 ring-amber-300/40">
              <UtensilsCrossed className="size-5 text-foreground/80" />
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-black/0" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <RatingPill
            ratingAverage={item.ratingAverage}
            ratingCount={item.ratingCount}
          />
          {item.imageType === "VARIANT_IMAGE" ? (
            <div className="inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-foreground ring-1 ring-black/10">
              {variantCount} variants
            </div>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {categoryLabel ? (
              <div className="text-xs font-medium text-white/75">
                {categoryLabel}
              </div>
            ) : null}
            <div className="truncate text-sm font-semibold text-white">
              {item.name}
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/92 px-2.5 py-1 text-xs font-semibold text-foreground ring-1 ring-black/10">
            {priceLabel}
          </div>
        </div>
      </div>

      <CardHeader className="gap-1 flex items-center justify-between">
        <div className="flex-1">
          <CardTitle className="text-sm">
            {item.name + " With " + selectedVariant}
          </CardTitle>

          {item.description ? (
            <p className="line-clamp-2 text-sm mt-1 text-muted-foreground">
              {item.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No description.</p>
          )}
        </div>
        {item.imageType === "VARIANT_IMAGE" ? (
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <div className="flex flex-col gap-2 w-full">
                <Select
                  defaultValue={selectedVariant}
                  onValueChange={setSelectedVariant}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={variantPreviewNames[0]}
                      className="text-xs"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {variantPreviewNames.map((name) => (
                        <SelectItem key={name} value={name} className="text-xs">
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {variantCount > variantPreviewNames.length ? (
                <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-xs text-foreground/70">
                  +{variantCount - variantPreviewNames.length} more
                </span>
              ) : null}
            </div>
          </CardContent>
        ) : null}
      </CardHeader>

      <CardFooter className="bg-muted/20 flex items-center justify-between gap-3 border-t">
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground">
            Starting from
          </span>
          <span className="text-base font-semibold">{priceLabel}</span>
        </div>
        <Button
          className="rounded-sm px-5 text-sm"
          onClick={() => handleAddToCart(item)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
