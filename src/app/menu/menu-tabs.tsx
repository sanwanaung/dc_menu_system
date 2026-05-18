"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useMemo } from "react";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
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
        .flatMap((c) => c.items.map((item) => ({ ...item, category: c.name })))
        .filter((i) => i.name),
    [categories],
  );

  return (
    <Tabs value={activeCategory} onValueChange={setCategory} className="w-full">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.name}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="mt-4">
        {allItems.length === 0 ? (
          <div className="text-muted-foreground">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allItems.map((item, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">
                  {item.category}
                </div>
                <div className="font-medium">{item.name}</div>
                {item.description ? (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.name} className="mt-4">
          {category.items.length === 0 ? (
            <div className="text-muted-foreground">No items found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="font-medium">{item.name}</div>
                  {item.description ? (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
