import { AddonDTO, AddonWithAddonCategoryDTO } from "@/features/addon/types";

export type CategoryFilter = "all" | string;
export type PriceFilter = "all" | "free" | "paid";
export type SortKey = "updatedDesc" | "nameAsc" | "priceAsc" | "priceDesc";

export function formatMoney(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  const formated = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
  }).format(safe);

  return formated;
}

// export function getAddonCategoryName(
//   categories: AddonCategory[],
//   addonCategoryId?: string | null,
// ) {
//   if (!addonCategoryId) return "Uncategorized";
//   return (
//     categories.find((c) => c.id === addonCategoryId)?.name ?? "Uncategorized"
//   );
// }

export function filterByPrice(addons: AddonDTO[], priceFilter: PriceFilter) {
  if (priceFilter === "free")
    return addons.filter((a) => Number(a.price) === 0);
  if (priceFilter === "paid") return addons.filter((a) => Number(a.price) > 0);
  return addons;
}

export function sortAddons(
  addons?: AddonWithAddonCategoryDTO[],
  sort?: SortKey,
) {
  if (!addons || !sort) return;
  const copy = [...addons];
  switch (sort) {
    case "nameAsc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "priceAsc":
      return copy.sort(
        (a, b) =>
          Number(a.price) - Number(b.price) || a.name.localeCompare(b.name),
      );
    case "priceDesc":
      return copy.sort(
        (a, b) =>
          Number(b.price) - Number(a.price) || a.name.localeCompare(b.name),
      );
    case "updatedDesc":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() ||
          a.name.localeCompare(b.name),
      );
  }
}
