"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AddonCategoryTotalCard from "./addon-category-total-card";
import AddonCategoryActions from "./addon-category-actions";
import {
  AvailabilityFilter,
  sortCategories,
  SortKey,
} from "./addon-category-utils";
import { normalize } from "@/utils";
import { allowedUserRole } from "@/lib";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { AddonCategoryCard } from "./addon-category-card";
import { useNewAddonCategory } from "@/hooks/stores/use-new-addon-category";
import { getAddonCategories } from "@/features/addon-category/actions";
import { AddonCategoryDTO } from "@/features/addon-category/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUpdateAddonCategoryAvailability } from "@/features/addon-category/hooks/mutations/use-update-addoncategory-availability";
import { useDeleteAddonCategory } from "@/hooks/stores/use-delete-addoncategory";

const AddonCategoryPage = () => {
  const { onOpenEditAddonCategory } = useNewAddonCategory();
  const { onOpenDeleteAddonCategory } = useDeleteAddonCategory();
  const mutation = useUpdateAddonCategoryAvailability();
  const session = authClient.useSession();
  const [sort, setSort] = useState<SortKey>("displayOrderAsc");
  const [filter, setFilter] = useState<AvailabilityFilter>("all");
  const [query, setQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const datas = useInfiniteQuery({
    queryKey: ["addon-category"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getAddonCategories({ limit: 9, offset: Number(pageParam) }),
    getNextPageParam: (lastPage, pages) => lastPage.data?.meta.nextPage,
  });

  const allAddonCategories = useMemo(() => {
    return datas.data?.pages.flatMap((item) => item.data?.items ?? []) ?? [];
  }, [datas.data]);

  const visibleCategories = useMemo(() => {
    const q = normalize(query);
    const filtered = allAddonCategories.filter((category) => {
      if (filter === "available") {
        return category.isAvailable;
      }
      if (filter === "unavailable") {
        return !category.isAvailable;
      }
      if (!q) return true;
      return normalize(category.name).includes(q);
    });
    return sortCategories(filtered, sort);
  }, [query, allAddonCategories, filter, sort]);

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

  const onEdit = async (m: AddonCategoryDTO) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    onOpenEditAddonCategory(m.id, "edit");
  };

  const onDelete = async (m: AddonCategoryDTO) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    if (!m.id) return;
    onOpenDeleteAddonCategory(m.id);
  };

  const onToggleAvailability = async (m: AddonCategoryDTO) => {
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    mutation.mutate(m.id);
  };

  if (datas.isPending || datas.isLoading) {
    return (
      <div className=" flex items-center justify-center w-full min-h-100">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <AddonCategoryTotalCard
          title="Total"
          count={datas.data?.pages[0].data?.meta.total ?? 0}
        />
        <AddonCategoryTotalCard
          title="Available"
          count={datas.data?.pages[0].data?.summary?.available ?? 0}
        />
        <AddonCategoryTotalCard
          title="Not Availabe"
          count={datas.data?.pages[0].data?.summary?.unavailable ?? 0}
        />
      </div>
      {/* Search, Filter , Sorting  */}
      <AddonCategoryActions
        sort={sort}
        filter={filter}
        setSort={setSort}
        setFilter={setFilter}
        query={query}
        setQuery={setQuery}
      />
      {/* display datas */}
      {allAddonCategories.length === 0 ? (
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
              <AddonCategoryCard
                key={category.id}
                category={category}
                onEdit={(c: AddonCategoryDTO) => onEdit(c)}
                onDelete={(c: AddonCategoryDTO) => onDelete(c)}
                onToggleAvailability={(c: AddonCategoryDTO) => {
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
  );
};

export default AddonCategoryPage;
