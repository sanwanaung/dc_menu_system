"use client";

import MenuCategoryActions from "./menu-category-actions";
import MenuCategoryTotalCard from "./menu-category-total-card";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import {
  AvailabilityFilter,
  sortCategories,
  SortKey,
} from "./menu-category-utils";
import { normalize } from "@/utils";
import { MenuCategoryCard } from "./menu-category-card";
import { getMenuCategories } from "@/features/menu-category/actions";
import { toast } from "sonner";
import { useNewMenuCategory } from "@/hooks/stores/use-new-menucategory";
import { authClient } from "@/lib/auth-client";
import { allowedUserRole } from "@/lib";
import { useDeleteMenuCategory } from "@/hooks/stores/use-delete-menucategory";
import { MenuCategoryDTO } from "@/features/menu-category/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUpdateMenuCategoryAvailability } from "@/features/menu-category/hooks/mutations/use-update-menucategory-availability";

const MenuCategories = () => {
  const { onOpenDelete } = useDeleteMenuCategory();
  const { onOpenEditMenuCategory } = useNewMenuCategory();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const session = authClient.useSession();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AvailabilityFilter>("all");
  const [sort, setSort] = useState<SortKey>("displayOrderAsc");
  const availabilityMutation = useUpdateMenuCategoryAvailability();

  const datas = useInfiniteQuery({
    queryKey: ["menu-category"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMenuCategories({ limit: 9, offset: Number(pageParam) }),
    getNextPageParam: (lastPage, pages) => lastPage.data?.meta.nextPage,
  });

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        datas.hasNextPage &&
        !datas.isFetchingNextPage
      ) {
        datas.fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [datas.fetchNextPage, datas.hasNextPage, datas.isFetchingNextPage]);

  const allMenuCategories = useMemo(() => {
    return datas.data?.pages.flatMap((item) => item.data?.items ?? []) ?? [];
  }, [datas.data]);

  const visibleCategories = useMemo(() => {
    const q = normalize(query);
    const filtered = allMenuCategories.filter((category) => {
      if (filter === "available" && !category.isAvailable) return false;
      if (filter === "unavailable" && category.isAvailable) return false;
      if (!q) return true;
      return normalize(category.name).includes(q);
    });

    return sortCategories(filtered, sort);
  }, [query, filter, sort, allMenuCategories]);

  const onEdit = async (m: MenuCategoryDTO) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    onOpenEditMenuCategory(m.id, "edit");
  };

  const onDelete = async (m: MenuCategoryDTO) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    if (!m.id) return;
    onOpenDelete(m.id);
  };

  const onToggleAvailability = async (m: MenuCategoryDTO) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    availabilityMutation.mutate(m.id);
  };

  return (
    <>
      {datas.isPending || datas.isLoading ? (
        <div className=" flex items-center justify-center w-full min-h-100">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <MenuCategoryTotalCard
              title="Total"
              count={datas.data?.pages[0].data?.meta.total ?? 0}
            />
            <MenuCategoryTotalCard
              title="Available"
              count={datas.data?.pages[0].data?.summary?.available ?? 0}
            />
            <MenuCategoryTotalCard
              title="Not Availabe"
              count={datas.data?.pages[0].data?.summary?.unavailable ?? 0}
            />
          </div>
          {/* Search, Filter , Sorting  */}
          <MenuCategoryActions
            sort={sort}
            filter={filter}
            setSort={setSort}
            setFilter={setFilter}
            query={query}
            setQuery={setQuery}
          />
          {/* Display Menu */}
          {allMenuCategories.length === 0 || !allMenuCategories ? (
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
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCategories.map((category) => (
                  <MenuCategoryCard
                    key={category.id}
                    category={category}
                    onEdit={(c: MenuCategoryDTO) => onEdit(c)}
                    onDelete={(c: MenuCategoryDTO) => onDelete(c)}
                    onToggleAvailability={(c: MenuCategoryDTO) => {
                      onToggleAvailability(c);
                    }}
                  />
                ))}
              </div>
              <div ref={loadMoreRef} className="h-1" />

              {datas.isFetchingNextPage && (
                <div className="flex justify-center py-2">
                  <Loader2 className="animate-spin size-6" />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MenuCategories;
