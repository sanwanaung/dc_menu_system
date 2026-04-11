import { AddonCategoryDTO } from "@/types/addon-category";

export type AvailabilityFilter = "all" | "available" | "unavailable";
export type SortKey = "displayOrderAsc" | "nameAsc" | "updatedDesc";

export function sortCategories(
  categories?: AddonCategoryDTO[],
  sort?: SortKey,
) {
  if (!categories || !sort) return [];
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
