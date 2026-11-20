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
import { CategoryFilter, PriceFilter, SortKey } from "./addon-utils";
import { useNewAddon } from "@/hooks/stores/use-new-addon";
import { AddonWithAddonCategoryDTO } from "@/features/addon/types";
import { useMemo } from "react";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  priceFilter: string;
  setPriceFilter: (v: PriceFilter) => void;
  categoryFilter: string;
  setCategoryFilter: (v: CategoryFilter) => void;
  sort: string;
  setSort: (v: SortKey) => void;
  addons: AddonWithAddonCategoryDTO[] | undefined;
};

export function AddonActions({
  query,
  setQuery,
  priceFilter,
  setPriceFilter,
  categoryFilter,
  setCategoryFilter,
  sort,
  setSort,
  addons,
}: Props) {
  const { onOpenNewAddon } = useNewAddon();

  const uniqueCategories = useMemo(() => {
    if (!addons) return [];
    const seen = new Set<string>();
    const categories: { id: string; name: string }[] = [];
    for (const addon of addons) {
      if (addon.addonCategory && !seen.has(addon.addonCategory?.id)) {
        seen.add(addon.addonCategory?.id);
        categories.push(addon.addonCategory);
      }
    }
    return categories;
  }, [addons]);

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
            {uniqueCategories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priceFilter}
          onValueChange={(v) => setPriceFilter(v as PriceFilter)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
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
          </SelectContent>
        </Select>
      </div>

      <Button type="button" onClick={() => onOpenNewAddon()}>
        <Plus className="mr-1.5 size-4" />
        Create addon
      </Button>
    </div>
  );
}
