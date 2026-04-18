"use client";

import * as React from "react";
import { toast } from "sonner";

import { useMenuStore } from "./menu-store";
import type { MenuItem, MenuItemUpsertInput } from "./types";
import {
  countCategoriesInUse,
  type AvailabilityFilter,
  type CategoryFilter,
  type SortKey,
  sortMenuItems,
} from "./menu-utils";
import { MenuItemsActions } from "./menu-items-actions";
import { MenuTotalCard } from "./menu-total-card";
import { MenuItemCard } from "./menu-item-card";
import { MenuItemFormDialog } from "./menu-item-form-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { normalize } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MenuItemsPage() {
  const categories = useMenuStore((s) => s.categories);
  const items = useMenuStore((s) => s.items);
  const createItem = useMenuStore((s) => s.createItem);
  const updateItem = useMenuStore((s) => s.updateItem);
  const deleteItem = useMenuStore((s) => s.deleteItem);
  const toggleAvailability = useMenuStore((s) => s.toggleAvailability);

  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] =
    React.useState<CategoryFilter>("all");
  const [availability, setAvailability] =
    React.useState<AvailabilityFilter>("all");
  const [sort, setSort] = React.useState<SortKey>("updatedDesc");

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create",
  );
  const [editing, setEditing] = React.useState<MenuItem | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<MenuItem | null>(
    null,
  );

  const visibleItems = React.useMemo(() => {
    const q = normalize(query);
    const filtered = items.filter((item) => {
      if (availability === "available" && !item.isAvailable) return false;
      if (availability === "hidden" && item.isAvailable) return false;
      if (categoryFilter !== "all" && item.categoryId !== categoryFilter)
        return false;
      if (!q) return true;
      return (
        normalize(item.name).includes(q) ||
        normalize(item.description ?? "").includes(q)
      );
    });
    return sortMenuItems(filtered, sort);
  }, [items, query, availability, categoryFilter, sort]);

  const stats = React.useMemo(() => {
    const total = items.length;
    const availableCount = items.filter((i) => i.isAvailable).length;
    const hiddenCount = total - availableCount;
    const categoriesInUse = countCategoriesInUse(items);
    return { total, availableCount, hiddenCount, categoriesInUse };
  }, [items]);

  const openCreate = () => {
    setDialogMode("create");
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setDialogMode("edit");
    setEditing(item);
    setDialogOpen(true);
  };

  const requestDelete = (item: MenuItem) => {
    setPendingDelete(item);
    setDeleteOpen(true);
  };

  const onReset = () => {
    setQuery("");
    setCategoryFilter("all");
    setAvailability("all");
    setSort("updatedDesc");
  };

  const handleCreate = (input: MenuItemUpsertInput) => {
    const created = createItem(input);
    toast.success(`Created “${created.name}”`);
  };

  const handleUpdate = (id: string, input: MenuItemUpsertInput) => {
    const updated = updateItem(id, input);
    if (!updated) return toast.error("Menu item not found.");
    toast.success(`Updated “${updated.name}”`);
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteItem(pendingDelete.id);
    toast.success(`Deleted “${pendingDelete.name}”`);
    setPendingDelete(null);
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <MenuTotalCard title="Total" value={stats.total} />
        <MenuTotalCard title="Available" value={stats.availableCount} />
        <MenuTotalCard title="Hidden" value={stats.hiddenCount} />
        <MenuTotalCard
          title="Categories in use"
          value={stats.categoriesInUse}
        />
      </div>

      <MenuItemsActions
        categories={categories}
        query={query}
        onQueryChange={setQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        availability={availability}
        onAvailabilityChange={setAvailability}
        sort={sort}
        onSortChange={setSort}
        onCreate={openCreate}
        onReset={onReset}
      />

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="mx-auto max-w-md text-center">
              <div className="text-base font-medium">No menu items yet</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Create your first item for guests to order via QR.
              </div>
              <div className="mt-4">
                <Button type="button" onClick={openCreate}>
                  Create menu item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : visibleItems.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="mx-auto max-w-md text-center">
              <div className="text-base font-medium">No results</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Try a different search query or adjust filters.
              </div>
              <div className="mt-4">
                <Button type="button" variant="outline" onClick={onReset}>
                  Reset filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              categories={categories}
              onEdit={() => openEdit(item)}
              onDelete={() => requestDelete(item)}
              onToggleAvailability={() => {
                toggleAvailability(item.id);
                toast.success(
                  item.isAvailable
                    ? `Hidden “${item.name}”`
                    : `Made “${item.name}” available`,
                );
              }}
            />
          ))}
        </div>
      )}

      <MenuItemFormDialog
        open={dialogOpen}
        mode={dialogMode}
        categories={categories}
        initialItem={editing}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete menu item?"
        description={
          pendingDelete
            ? `This will remove “${pendingDelete.name}” from the menu. This action can’t be undone.`
            : undefined
        }
        confirmLabel="Delete"
        destructive={true}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setPendingDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
