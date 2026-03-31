"use client";

import { MenuCategory } from "generated/prisma/client";
import MenuCategoryActions from "./menu-category-actions";
import MenuCategoryTotalCard from "./menu-category-total-card";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AvailabilityFilter,
  sortCategories,
  SortKey,
} from "./menu-category-utils";
import { normalize } from "@/utils";
import { MenuCategoryCard } from "./menu-category-card";
import { updateAvailable } from "@/actions/menu-category";
import { toast } from "sonner";
import { useNewMenuCategory } from "@/hooks/use-new-menucategory";
import { authClient } from "@/lib/auth-client";
import { allowedUserRole } from "@/lib";
import { useDeleteMenuCategory } from "@/hooks/use-delete-menucategory";

type MenuCategoryProps = {
  menuCategories: MenuCategory[];
  available: number;
  unavailable: number;
};

type Props = {
  menuCategories: MenuCategoryProps;
};

const MenuCategories = ({ menuCategories }: Props) => {
  const { onOpenDelete } = useDeleteMenuCategory();
  const { onOpenEditMenuCategory } = useNewMenuCategory();
  const [datas, setDatas] = useState<MenuCategoryProps>(
    () => menuCategories ?? {},
  );
  const session = authClient.useSession();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AvailabilityFilter>("all");
  const [sort, setSort] = useState<SortKey>("displayOrderAsc");

  useEffect(() => {
    setDatas(menuCategories);
  }, [menuCategories]);

  const visibleCategories = useMemo(() => {
    const q = normalize(query);
    const filtered = datas.menuCategories.filter((category) => {
      if (filter === "available" && !category.isAvailable) return false;
      if (filter === "unavailable" && category.isAvailable) return false;
      if (!q) return true;
      return normalize(category.name).includes(q);
    });

    return sortCategories(filtered, sort);
  }, [datas, query, filter, sort]);

  const onEdit = async (m: MenuCategory) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    onOpenEditMenuCategory(m.id, "edit");
  };

  const onDelete = async (m: MenuCategory) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    if (!m.id) return;
    onOpenDelete(m.id);
  };

  const onToggleAvailability = async (m: MenuCategory) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    const result = await updateAvailable(m.id);
    if (result.error) return toast.error(result.error);
    const alterText = result.data?.isAvailable
      ? "Marked as available"
      : "Marked as unavailable";
    toast.success(alterText);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MenuCategoryTotalCard
          title="Total"
          count={menuCategories.menuCategories.length}
        />
        <MenuCategoryTotalCard
          title="Available"
          count={menuCategories.available}
        />
        <MenuCategoryTotalCard
          title="Not Availabe"
          count={menuCategories.unavailable}
        />
      </div>
      {/* Search , Sorting  */}
      <MenuCategoryActions
        sort={sort}
        filter={filter}
        setSort={setSort}
        setFilter={setFilter}
      />
      {/* Display Menu */}
      {menuCategories.menuCategories.length === 0 ||
      !menuCategories.menuCategories ? (
        <Card>
          <CardContent className="py-10">
            <div className="mx-auto max-w-md text-center">
              <div className="text-base font-medium">No categories yet</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Create a category to start organizing your menu.
              </div>
              <div className="mt-4">
                <Button type="button">
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
              onEdit={(c: MenuCategory) => onEdit(c)}
              onDelete={(c: MenuCategory) => onDelete(c)}
              onToggleAvailability={(c: MenuCategory) => {
                onToggleAvailability(c);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuCategories;
