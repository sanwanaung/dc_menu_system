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
import { AvailabilityFilter, SortKey } from "./variant-option-utils";
import { useVariantOption } from "@/hooks/use-variant-option";

type Props = {
  filter: AvailabilityFilter;
  setFilter: (v: AvailabilityFilter) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  query: string;
  setQuery: (v: string) => void;
};

const MenuCategoryActions = ({
  setFilter,
  filter,
  sort,
  setSort,
  query,
  setQuery,
}: Props) => {
  const { onOpenNewVariantOption } = useVariantOption();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="pl-9"
          />
        </div>

        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as AvailabilityFilter)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Filter" />
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
            <SelectItem value="displayOrderAsc">Order (asc)</SelectItem>
            <SelectItem value="nameAsc">Name (A–Z)</SelectItem>
            <SelectItem value="updatedDesc">Recently updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="button" onClick={() => onOpenNewVariantOption("create")}>
        <Plus className="mr-1.5 size-4" />
        Create Option
      </Button>
    </div>
  );
};

export default MenuCategoryActions;
