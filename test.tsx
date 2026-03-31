"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, LayoutGrid, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalize } from "@/utils";

import { menuCategoriesDemo } from "./demo";
import type { MenuCategory } from "./types";
import { MenuCategoryCard } from "./menu-category-card";
import {
  MenuCategoryFormDialog,
  type MenuCategoryFormResult,
} from "./menu-category-form-dialog";
import { MenuCategoryDeleteDialog } from "./menu-category-delete-dialog";
import type { MenuCategoryFormValues } from "./menu-category-schema";

type AvailabilityFilter = "all" | "available" | "unavailable";
type SortKey = "displayOrderAsc" | "nameAsc" | "updatedDesc";

function createId() {
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  return `cat_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function sortCategories(categories: MenuCategory[], sort: SortKey) {
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

export default function MenuCategoriesPage() {
  const [categories, setCategories] = React.useState<MenuCategory[]>(
    () => menuCategoriesDemo,
  );

  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<AvailabilityFilter>("all");
  const [sort, setSort] = React.useState<SortKey>("displayOrderAsc");

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MenuCategory | null>(null);
  const [deleting, setDeleting] = React.useState<MenuCategory | null>(null);

  const stats = React.useMemo(() => {
    const available = categories.filter((c) => c.isAvailable).length;
    return {
      total: categories.length,
      available,
      unavailable: categories.length - available,
    };
  }, [categories]);

  const visibleCategories = React.useMemo(() => {
    const q = normalize(query);
    const filtered = categories.filter((category) => {
      if (filter === "available" && !category.isAvailable) return false;
      if (filter === "unavailable" && category.isAvailable) return false;
      if (!q) return true;
      return normalize(category.name).includes(q);
    });

    return sortCategories(filtered, sort);
  }, [categories, query, filter, sort]);

  const createDefaults = React.useMemo(
    () => ({
      name: "",
      displayOrder: categories.length
        ? Math.max(...categories.map((c) => c.displayOrder)) + 1
        : 0,
      isAvailable: true,
    }),
    [categories],
  );

  const upsert = React.useCallback((updated: MenuCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === updated.id);
      if (!exists) return [updated, ...prev];
      return prev.map((c) => (c.id === updated.id ? updated : c));
    });
  }, []);

  const remove = React.useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const submitCreate = React.useCallback(
    async (values: MenuCategoryFormValues): Promise<MenuCategoryFormResult> => {
      const nextName = values.name.trim();
      const conflict = categories.some(
        (c) => normalize(c.name) === normalize(nextName),
      );
      if (conflict) {
        return {
          ok: false,
          fieldErrors: { name: "A category with this name already exists." },
        };
      }

      const now = new Date();
      upsert({
        id: createId(),
        name: nextName,
        displayOrder: values.displayOrder,
        isAvailable: values.isAvailable,
        createdAt: now,
        updatedAt: now,
      });

      toast.success("Category created.");
      return { ok: true };
    },
    [categories, upsert],
  );

  const submitEdit = React.useCallback(
    async (values: MenuCategoryFormValues): Promise<MenuCategoryFormResult> => {
      if (!editing) return { ok: false, error: "No category selected." };

      const nextName = values.name.trim();
      const conflict = categories.some(
        (c) => c.id !== editing.id && normalize(c.name) === normalize(nextName),
      );
      if (conflict) {
        return {
          ok: false,
          fieldErrors: { name: "A category with this name already exists." },
        };
      }

      upsert({
        ...editing,
        name: nextName,
        displayOrder: values.displayOrder,
        isAvailable: values.isAvailable,
        updatedAt: new Date(),
      });

      toast.success("Category updated.");
      setEditing(null);
      return { ok: true };
    },
    [editing, categories, upsert],
  );

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card size="sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.available}</div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Hidden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.unavailable}</div>
            </CardContent>
          </Card>
        </div>

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
                <SelectItem value="unavailable">Hidden</SelectItem>
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

          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 size-4" />
            Create category
          </Button>
        </div>

        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="mx-auto max-w-md text-center">
                <div className="text-base font-medium">No categories yet</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Create a category to start organizing your menu.
                </div>
                <div className="mt-4">
                  <Button type="button" onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-1.5 size-4" />
                    Create category
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : visibleCategories.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="mx-auto max-w-md text-center">
                <div className="text-base font-medium">No results</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Try a different search query or adjust the filters.
                </div>
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                      setSort("displayOrderAsc");
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((category) => (
              <MenuCategoryCard
                key={category.id}
                category={category}
                onEdit={(c) => setEditing(c)}
                onDelete={(c) => setDeleting(c)}
                onToggleAvailability={(c) => {
                  upsert({
                    ...c,
                    isAvailable: !c.isAvailable,
                    updatedAt: new Date(),
                  });
                  toast.success(
                    c.isAvailable ? "Category hidden." : "Category available.",
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>

      <MenuCategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        initialValues={createDefaults}
        onSubmit={submitCreate}
      />

      <MenuCategoryFormDialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        mode="edit"
        initialValues={
          editing
            ? {
                name: editing.name,
                displayOrder: editing.displayOrder,
                isAvailable: editing.isAvailable,
              }
            : undefined
        }
        onSubmit={submitEdit}
      />

      <MenuCategoryDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        categoryName={deleting?.name ?? null}
        onConfirm={() => {
          if (!deleting) return;
          remove(deleting.id);
          toast.success("Category deleted.");
          setDeleting(null);
        }}
      />
    </>
  );
}
