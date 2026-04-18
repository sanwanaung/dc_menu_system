import type { MenuCategory, MenuItem } from "./types";

export type AvailabilityFilter = "all" | "available" | "hidden";
export type CategoryFilter = "all" | string;
export type SortKey =
  | "updatedDesc"
  | "nameAsc"
  | "priceAsc"
  | "priceDesc"
  | "displayOrderAsc";

export function formatMoney(amount: number, currency = "USD") {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(safe);
}

export function getCategoryName(
  categories: MenuCategory[],
  categoryId: string,
) {
  return categories.find((c) => c.id === categoryId)?.name ?? "Uncategorized";
}

export function sortMenuItems(items: MenuItem[], sort: SortKey) {
  const copy = [...items];
  switch (sort) {
    case "nameAsc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "priceAsc":
      return copy.sort(
        (a, b) => a.price - b.price || a.name.localeCompare(b.name),
      );
    case "priceDesc":
      return copy.sort(
        (a, b) => b.price - a.price || a.name.localeCompare(b.name),
      );
    case "displayOrderAsc":
      return copy.sort(
        (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
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

export function countCategoriesInUse(items: MenuItem[]) {
  return new Set(items.map((i) => i.categoryId)).size;
}

