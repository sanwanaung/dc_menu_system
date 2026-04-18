"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";

import type { MenuCategory } from "./types";
import type {
  AvailabilityFilter,
  CategoryFilter,
  SortKey,
} from "./menu-utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MenuItemsActions({
  categories,
  query,
  onQueryChange,
  categoryFilter,
  onCategoryFilterChange,
  availability,
  onAvailabilityChange,
  sort,
  onSortChange,
  onCreate,
  onReset,
}: {
  categories: MenuCategory[];
  query: string;
  onQueryChange: (value: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (value: CategoryFilter) => void;
  availability: AvailabilityFilter;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  onCreate: () => void;
  onReset: () => void;
}) {
  const categoryOptions = categories
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((c) => ({ id: c.id, name: c.name }));

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex-1">
            <InputGroup>
              <InputGroupAddon className="pl-2">
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search menu items…"
                aria-label="Search menu items"
              />
            </InputGroup>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            <Select
              value={categoryFilter}
              onValueChange={(v) => onCategoryFilterChange(v as CategoryFilter)}
            >
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categoryOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={availability}
              onValueChange={(v) =>
                onAvailabilityChange(v as AvailabilityFilter)
              }
            >
              <SelectTrigger className="w-full lg:w-[170px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(v) => onSortChange(v as SortKey)}
            >
              <SelectTrigger className="w-full lg:w-[220px]">
                <SlidersHorizontal className="mr-2 size-4 text-muted-foreground" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedDesc">Recently updated</SelectItem>
                <SelectItem value="nameAsc">Name (A–Z)</SelectItem>
                <SelectItem value="priceAsc">Price (low–high)</SelectItem>
                <SelectItem value="priceDesc">Price (high–low)</SelectItem>
                <SelectItem value="displayOrderAsc">Display order</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onReset}>
                Reset
              </Button>
              <Button type="button" onClick={onCreate}>
                <Plus className="mr-1.5 size-4" />
                Create
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
