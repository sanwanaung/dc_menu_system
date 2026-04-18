"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VariantOptionTotalCard from "./variant-option-total-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getVariantOptions } from "@/actions/variant-option";
import { Loader2, Plus } from "lucide-react";
import VariantOptionActions from "./variant-option-actions";
import {
  AvailabilityFilter,
  sortCategories,
  SortKey,
} from "./variant-option-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { normalize } from "@/utils";
import VariantOptionCard from "./variant-option-card";
import { VariantOptionDTO } from "@/types/variant-option";
import { authClient } from "@/lib/auth-client";
import { allowedUserRole } from "@/lib";
import { toast } from "sonner";
import { useToggleAvailabilityMutation } from "@/hooks/mutations/variant-option/use-toggle-availability";
import { useVariantOption } from "@/hooks/use-variant-option";

const VariantOption = () => {
  const { onOpenEditVariantOptin, onOpenDeleteVariantOption } =
    useVariantOption();
  const toggleMutation = useToggleAvailabilityMutation();
  const [filter, setFilter] = useState<AvailabilityFilter>("all");
  const [sort, setSort] = useState<SortKey>("displayOrderAsc");
  const [query, setQuery] = useState<string>("");
  const session = authClient.useSession();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const datas = useInfiniteQuery({
    queryKey: ["variant-option"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getVariantOptions({ limit: 9, offset: Number(pageParam) }),
    getNextPageParam: (lastPage, pages) => lastPage.data?.meta.nextPage,
  });

  const allVariantOptions = useMemo(() => {
    return datas.data?.pages.flatMap((item) => item.data?.items ?? []) ?? [];
  }, [datas.data]);

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

  const visibleVariantOptions = useMemo(() => {
    const q = normalize(query);
    const filtered = allVariantOptions.filter((item) => {
      if (filter === "available" && !item.isAvailable) return false;
      if (filter === "unavailable" && item.isAvailable) return false;

      if (!q) return true;
      return normalize(item.name).includes(q);
    });
    return sortCategories(filtered, sort);
  }, [query, filter, sort, allVariantOptions]);

  const onDelete = (v: VariantOptionDTO) => {
    if (!v) return null;
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    onOpenDeleteVariantOption(v.id, "delete");
  };

  const onEdit = (v: VariantOptionDTO) => {
    if (!v) return null;
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    onOpenEditVariantOptin(v.id, "edit");
  };

  const onToggleAvailability = (v: VariantOptionDTO) => {
    if (!v) return null;
    if (session.data?.user.role !== allowedUserRole.ADMIN)
      return toast.error("You don't have permission!");
    toggleMutation.mutate({ id: v.id });
  };

  return (
    <>
      {datas.isPending || datas.isLoading ? (
        <div className=" flex items-center justify-center w-full min-h-100">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <VariantOptionTotalCard
              title="Total"
              count={datas.data?.pages[0].data?.meta.total ?? 0}
            />
            <VariantOptionTotalCard
              title="Available"
              count={datas.data?.pages[0].data?.summary?.available ?? 0}
            />
            <VariantOptionTotalCard
              title="Not Availabe"
              count={datas.data?.pages[0].data?.summary?.unavailable ?? 0}
            />
          </div>
          <VariantOptionActions
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            query={query}
            setQuery={setQuery}
          />
          {allVariantOptions.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <div className="mx-auto max-w-md text-center">
                  <div className="text-base font-medium">No variant yet</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Create a variant option to start.
                  </div>
                  <div className="mt-4">
                    <Button type="button">
                      <Plus className="mr-1.5 size-4" />
                      Create option
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : visibleVariantOptions.length === 0 ? (
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
                {visibleVariantOptions.map((variantOpt) => (
                  <VariantOptionCard
                    key={variantOpt.id}
                    variantOpt={variantOpt}
                    onDelete={() => onDelete(variantOpt)}
                    onEdit={() => onEdit(variantOpt)}
                    onToggleAvailability={() =>
                      onToggleAvailability(variantOpt)
                    }
                  />
                ))}

                <div ref={loadMoreRef} className="h-1" />

                {datas.isFetchingNextPage && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="animate-spin size-6" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default VariantOption;
