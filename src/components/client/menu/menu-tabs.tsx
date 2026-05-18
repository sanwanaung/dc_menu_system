"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useMemo } from "react";

import { MenuItemCard, type MenuItemData } from "./menu-item-card";

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItemData[];
};

export default function MenuTabs({
  categories,
  activeCategory,
}: {
  categories: MenuCategory[];
  activeCategory: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCategory = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value.toLowerCase() === "all") next.delete("category");
      else next.set("category", value);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const allItems = useMemo(
    () =>
      categories
        .flatMap((c) =>
          c.items.map((item) => ({
            item,
            categoryId: c.id,
            categoryName: c.name,
          })),
        )
        .filter((x) => x.item.name),
    [categories],
  );

  return (
    <Tabs
      value={activeCategory}
      onValueChange={setCategory}
      className="w-full "
    >
      <TabsList
        variant="line"
        className="px-2 py-1 min-w-full md:min-w-2xl mx-auto overflow-y-hidden overflow-x-scroll md:overflow-x-hidden "
      >
        <TabsTrigger value="all" className="capitalize px-2 py-3">
          All
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.name}
            className="capitalize px-2 py-3"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="mt-4">
        {allItems.length === 0 ? (
          <div className="text-muted-foreground font-semibold text-center w-full">
            No items found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allItems.map(({ item, categoryId, categoryName }) => (
              <MenuItemCard
                key={`${categoryId}:${item.id}`}
                item={item}
                categoryLabel={categoryName}
              />
            ))}
          </div>
        )}
      </TabsContent>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.name} className="mt-4">
          {category.items.length === 0 ? (
            <div className="text-muted-foreground font-semibold w-full text-center">
              No menu items found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
