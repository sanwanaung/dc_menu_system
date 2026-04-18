"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AddonTotalCard from "./addon-total-card";
import { AddonActions } from "./addon-actions";
import {
  CategoryFilter,
  PriceFilter,
  sortAddons,
  SortKey,
} from "./addon-utils";
import { normalize } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNewAddon } from "@/hooks/use-new-addon";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAddons } from "@/actions/addon";
import { AddonCard } from "./addon-card";
import { Loader2 } from "lucide-react";

const AddonPage = () => {
  const { onOpenNewAddon } = useNewAddon();
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("updatedDesc");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const datas = useInfiniteQuery({
    queryKey: ["addon"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getAddons({ limit: 10, offset: Number(pageParam) }),
    getNextPageParam: (lastPage, pages) => lastPage.data?.meta.nextPage,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          (entries[0].isIntersecting &&
            datas.hasNextPage &&
            !datas.isFetchingNextPage) ||
          hasScrolled
        ) {
          datas.fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [datas.fetchNextPage, datas.hasNextPage, datas.isFetchingNextPage]);

  const allAddons = useMemo(() => {
    return datas.data?.pages.flatMap((p) => p.data?.items ?? []);
  }, [datas.data]);

  const visibleAddons = useMemo(() => {
    const q = normalize(query);
    const filterd = allAddons?.filter((addon) => {
      if (priceFilter === "free" && addon.status !== "FREE") return false;
      if (priceFilter === "paid" && addon.status !== "PAID") return false;
      if (
        categoryFilter !== "all" &&
        categoryFilter !== addon.addonCategory?.name
      )
        return false;
      if (q) return normalize(addon.name).includes(q);
      return true;
    });
    return sortAddons(filterd, sort);
  }, [query, priceFilter, categoryFilter, sort, allAddons]);

  const categoryInUse = useMemo(() => {
    const categoryNames = datas.data?.pages[0].data?.items.map(
      (c) => c.addonCategory?.name,
    );
    return categoryNames?.length;
  }, [datas]);

  if (datas.isPending || datas.isLoading)
    return (
      <div className=" flex items-center justify-center w-full min-h-100">
        <Loader2 className="animate-spin size-6" />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <AddonTotalCard
          title="Total"
          count={datas.data?.pages[0].data?.meta.total}
        />
        <AddonTotalCard
          title="Paid"
          count={datas.data?.pages[0].data?.summary?.paid}
        />
        <AddonTotalCard
          title="Free"
          count={datas.data?.pages[0].data?.summary?.free}
        />
        <AddonTotalCard title="CategoryInUse" count={categoryInUse} />
      </div>
      <AddonActions
        sort={sort}
        setSort={setSort}
        query={query}
        setQuery={setQuery}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        addons={datas.data?.pages[0].data?.items}
      />
      {datas.data?.pages[0].data?.items.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="mx-auto max-w-md text-center">
              <div className="text-base font-medium">No addons yet</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Create addons to attach them to menu items later.
              </div>
              <div className="mt-4">
                <Button type="button" onClick={() => onOpenNewAddon()}>
                  Create addon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : visibleAddons?.length === 0 ? (
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
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleAddons?.map((addon) => (
              <AddonCard key={addon.id} addon={addon} />
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

export default AddonPage;
