import { MenuCategory } from "generated/prisma/client";

export type AvailabilityFilter = "all" | "available" | "unavailable";
export type SortKey = "displayOrderAsc" | "nameAsc" | "updatedDesc";

export function sortCategories(categories: MenuCategory[], sort: SortKey) {
  const copy = [...categories];
  switch (sort) {
    case "nameAsc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "updatedDesc":
      return copy.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    case "displayOrderAsc":
    default:
      return copy.sort(
        (a, b) =>
          a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
      );
  }
}
