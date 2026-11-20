import { MenuItemDTO } from "@/features/menu-item/types";

export type AvailabilityFilter = "all" | "available" | "unavailable";
export type CategoryFilter = "all" | string;
export type SortKey =
  | "updatedDesc"
  | "nameAsc"
  | "priceAsc"
  | "priceDesc"
  | "displayOrderAsc";

export function sortMenuItems(items: MenuItemDTO[] = [], sort: SortKey) {
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
        (a, b) =>
          a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
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
