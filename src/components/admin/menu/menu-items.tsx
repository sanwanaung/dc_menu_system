"use client";

import { getMenuItems } from "@/actions/menu-item";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MenuTotalCard } from "./menu-total-card";
import { useMemo, useState } from "react";
import { MenuItemActions } from "./menu-items-actions";
import { AvailabilityFilter, CategoryFilter, SortKey } from "./menu-utils";

const MenuItemPage = () => {
  const [query, setQuery] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("updatedDesc");

  const datas = useInfiniteQuery({
    queryKey: ["addon"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMenuItems({ limit: 10, offset: Number(pageParam) }),
    getNextPageParam: (lastPage, pages) => lastPage.data?.meta.nextPage,
  });

  const allMenuItems = useMemo(() => {
    return datas.data?.pages.flatMap((p) => p.data?.items ?? []);
  }, [datas.data]);

  const categoryInUse = useMemo(() => {
    const categories = datas.data?.pages[0].data?.items.map((item) => {
      return item.category?.name;
    });
    return categories?.length;
  }, [datas]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <MenuTotalCard
          title="Total"
          count={datas.data?.pages[0].data?.meta.total ?? 0}
        />
        <MenuTotalCard
          title="Available"
          count={datas.data?.pages[0].data?.summary?.available ?? 0}
        />
        <MenuTotalCard
          title="Unavailable"
          count={datas.data?.pages[0].data?.summary?.unavailable ?? 0}
        />
        <MenuTotalCard title="CategoryInUse" count={categoryInUse ?? 0} />
      </div>
      <MenuItemActions
        query={query}
        setQuery={setQuery}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sort={sort}
        setSort={setSort}
        menuItems={allMenuItems}
      />
    </div>
  );
};

export default MenuItemPage;
