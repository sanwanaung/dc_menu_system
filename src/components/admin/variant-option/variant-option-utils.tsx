import { VariantOptionDTO } from "@/types/variant-option";

export type AvailabilityFilter = "all" | "available" | "unavailable";
export type SortKey = "displayOrderAsc" | "nameAsc" | "updatedDesc";

export function sortCategories(categories: VariantOptionDTO[], sort: SortKey) {
  const copy = [...categories];
  switch (sort) {
    case "nameAsc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "updatedDesc":
      return copy.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    case "displayOrderAsc":
    default:
      return copy.sort(
        (a, b) =>
          a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
      );
  }
}

export const formatedCurrency = (amount: number) => {
  const safe = Number.isFinite(amount) ? amount : 0;
  const formated = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
  }).format(safe);

  return formated;
};
