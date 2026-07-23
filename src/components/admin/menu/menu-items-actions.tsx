"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, Plus, Search } from "lucide-react";
import { AvailabilityFilter, CategoryFilter, SortKey } from "./menu-utils";
import { MenuItemDTO } from "@/types/menu-item";
import { useMenuItem } from "@/hooks/use-menu-item";
import { useMemo } from "react";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  availabilityFilter: AvailabilityFilter;
  setAvailabilityFilter: (v: AvailabilityFilter) => void;
  categoryFilter: CategoryFilter;
  setCategoryFilter: (v: CategoryFilter) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  menuItems: MenuItemDTO[] | undefined;
};

export function MenuItemActions({
  query,
  setQuery,
  availabilityFilter,
  setAvailabilityFilter,
  categoryFilter,
  setCategoryFilter,
  sort,
  setSort,
  menuItems,
}: Props) {
  const { onOpenNewMenuItem } = useMenuItem();

  const uniqueCategories = useMemo(() => {
    if (!menuItems) return [];
    const seen = new Set<string>();
    const categories: { id: string; name: string }[] = [];

    for (const menuItem of menuItems) {
      for (const category of menuItem.menuCategoryMenuItems) {
        if (!seen.has(category.menuCategory.id)) {
          seen.add(category.menuCategory.id);
          categories.push(category.menuCategory);
        }
      }
    }
    return categories;
  }, [menuItems]);

  console.log("hello");

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search addons..."
            className="pl-9"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {uniqueCategories?.map((item) => (
              <SelectItem key={item.id} value={item.name ?? "a"}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={availabilityFilter}
          onValueChange={(v) => setAvailabilityFilter(v as AvailabilityFilter)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger size="sm">
            <LayoutGrid className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedDesc">Recently updated</SelectItem>
            <SelectItem value="nameAsc">Name (A–Z)</SelectItem>
            <SelectItem value="priceAsc">Price (low → high)</SelectItem>
            <SelectItem value="priceDesc">Price (high → low)</SelectItem>
            <SelectItem value="displayOrderAsc">Order (asc)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="button" onClick={() => onOpenNewMenuItem()}>
        <Plus className="mr-1.5 size-4" />
        Create Menu Item
      </Button>
    </div>
  );
}
