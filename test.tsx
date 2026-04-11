"use client";

import * as React from "react";
import { toast } from "sonner";

import type {
  Addon,
  AddonCategory,
  CategoryFilter,
  PriceFilter,
  SortKey,
} from "./types";
import { AddonActions } from "./addon-actions";
import { AddonCard } from "./addon-card";
import { AddonFormDialog } from "./addon-form-dialog";
import { filterByPrice, sortAddons } from "./addon-utils";
import { normalize } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function createId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);
  return `${prefix}_${random}`;
}

export function AddonsPage({
  initialAddons,
  addonCategories,
}: {
  initialAddons: Addon[];
  addonCategories: AddonCategory[];
}) {
  const [addons, setAddons] = React.useState<Addon[]>(
    () => initialAddons ?? [],
  );
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] =
    React.useState<CategoryFilter>("all");
  const [priceFilter, setPriceFilter] = React.useState<PriceFilter>("all");
  const [sort, setSort] = React.useState<SortKey>("updatedDesc");

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingAddon, setEditingAddon] = React.useState<Addon | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingAddon, setDeletingAddon] = React.useState<Addon | null>(null);

  const stats = React.useMemo(() => {
    const total = addons.length;
    const free = addons.filter((a) => a.price === 0).length;
    const paid = total - free;
    const categoriesInUse = new Set(
      addons.map((a) => a.addonCategoryId).filter(Boolean) as string[],
    ).size;
    return { total, free, paid, categoriesInUse };
  }, [addons]);

  const visibleAddons = React.useMemo(() => {
    const q = normalize(query);
    let filtered = addons;

    if (categoryFilter !== "all") {
      filtered = filtered.filter((a) => a.addonCategoryId === categoryFilter);
    }
    filtered = filterByPrice(filtered, priceFilter);

    if (q) {
      filtered = filtered.filter((a) => normalize(a.name).includes(q));
    }

    return sortAddons(filtered, sort);
  }, [addons, query, categoryFilter, priceFilter, sort]);

  const openCreate = () => {
    setFormMode("create");
    setEditingAddon(null);
    setFormOpen(true);
  };

  const openEdit = (addon: Addon) => {
    setFormMode("edit");
    setEditingAddon(addon);
    setFormOpen(true);
  };

  const openDelete = (addon: Addon) => {
    setDeletingAddon(addon);
    setDeleteOpen(true);
  };

  const handleSubmitAddon = async (values: {
    name: string;
    price: number;
    addonCategoryId: string | null;
  }) => {
    const nowIso = new Date().toISOString();

    if (formMode === "create") {
      const next: Addon = {
        id: createId("ad"),
        name: values.name,
        price: values.price,
        addonCategoryId: values.addonCategoryId,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setAddons((prev) => [next, ...prev]);
      toast.success("Addon created (demo).");
      return;
    }

    if (!editingAddon) return;
    setAddons((prev) =>
      prev.map((a) =>
        a.id === editingAddon.id
          ? {
              ...a,
              name: values.name,
              price: values.price,
              addonCategoryId: values.addonCategoryId,
              updatedAt: nowIso,
            }
          : a,
      ),
    );
    toast.success("Addon updated (demo).");
  };

  const handleConfirmDelete = () => {
    if (!deletingAddon) return;
    setAddons((prev) => prev.filter((a) => a.id !== deletingAddon.id));
    setDeleteOpen(false);
    setDeletingAddon(null);
    toast.success("Addon deleted (demo).");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent className="py-4 text-2xl font-semibold">
            {stats.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Free</CardTitle>
          </CardHeader>
          <CardContent className="py-4 text-2xl font-semibold">
            {stats.free}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Paid</CardTitle>
          </CardHeader>
          <CardContent className="py-4 text-2xl font-semibold">
            {stats.paid}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Categories in use</CardTitle>
          </CardHeader>
          <CardContent className="py-4 text-2xl font-semibold">
            {stats.categoriesInUse}
          </CardContent>
        </Card>
      </div>

      <AddonActions
        categories={addonCategories}
        query={query}
        setQuery={setQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sort={sort}
        setSort={setSort}
        onCreate={openCreate}
      />

      {addons.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="mx-auto max-w-md text-center">
              <div className="text-base font-medium">No addons yet</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Create addons to attach them to menu items later.
              </div>
              <div className="mt-4">
                <Button type="button" onClick={openCreate}>
                  Create addon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : visibleAddons.length === 0 ? (
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
                    setCategoryFilter("all");
                    setPriceFilter("all");
                    setSort("updatedDesc");
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
          {visibleAddons.map((addon) => (
            <AddonCard
              key={addon.id}
              addon={addon}
              categories={addonCategories}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      <AddonFormDialog
        open={formOpen}
        mode={formMode}
        addon={editingAddon}
        categories={addonCategories}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitAddon}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete addon</DialogTitle>
            <DialogDescription>
              This removes{" "}
              <span className="font-medium">{deletingAddon?.name}</span> from
              demo data. Backend integration comes later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
