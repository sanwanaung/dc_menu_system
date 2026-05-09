"use client";

import { getMenuItems } from "@/actions/menu-item";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MenuTotalCard } from "./menu-total-card";
import { useMemo, useState } from "react";
import { MenuItemActions } from "./menu-items-actions";
import {
  AvailabilityFilter,
  CategoryFilter,
  SortKey,
  sortMenuItems,
} from "./menu-utils";
import { normalize } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMenuItem } from "@/hooks/use-menu-item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import {
  ChevronRight,
  Ellipsis,
  Eye,
  ImageIcon,
  Layers,
  TableOfContents,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MenuItemPage = () => {
  const { onOpenNewMenuItem } = useMenuItem();
  const [query, setQuery] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("updatedDesc");
  const router = useRouter();

  const datas = useInfiniteQuery({
    queryKey: ["menu-item"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMenuItems({ limit: 9, offset: Number(pageParam) }),
    getNextPageParam: (lastPage, pages) => lastPage.data?.meta.nextPage,
  });

  const allMenuItems = useMemo(() => {
    return datas.data?.pages.flatMap((p) => p.data?.items ?? []);
  }, [datas.data]);

  const categoryInUse = useMemo(() => {
    const categories = datas.data?.pages[0].data?.items.map((item) => {
      return item.menuCategoryMenuItems.map((item) => item.menuCategory.name);
    });
    return categories?.length;
  }, [datas]);

  const visibleMenuItems = useMemo(() => {
    const q = normalize(query);
    const filtered = allMenuItems?.filter((item) => {
      if (availabilityFilter === "available" && !item.isAvailable) return false;
      if (availabilityFilter === "unavailable" && item.isAvailable)
        return false;
      const categoryNames = item.menuCategoryMenuItems.map(
        (item) => item.menuCategory.name,
      );
      if (categoryFilter !== "all" && !categoryNames.includes(categoryFilter)) {
        return false;
      }
      if (q) return normalize(item.name).includes(q);
      return true;
    });
    return sortMenuItems(filtered, sort);
  }, [query, availabilityFilter, categoryFilter, sort, allMenuItems]);

  console.log("visibleMeuItems: ", visibleMenuItems);

  const formatMoney = (amount: number) => {
    const safe = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MMK",
    }).format(safe);
  };

  const viewMenuDetails = (menuItemId: string, variantId?: string) => {
    router.push(`menu-items/${menuItemId}?variantId=${variantId ?? ""}`);
  };

  const AvailabilityPill = ({ isAvailable }: { isAvailable: boolean }) => (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        isAvailable
          ? "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300"
          : "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-300",
      ].join(" ")}
    >
      <span
        className={[
          "mr-1.5 inline-block size-1.5 rounded-full",
          isAvailable ? "bg-emerald-500" : "bg-rose-500",
        ].join(" ")}
      />
      {isAvailable ? "Available" : "Unavailable"}
    </span>
  );

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
      {datas.data?.pages[0].data?.items.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="mx-auto max-w-md text-center">
              <div className="text-base font-medium">No menuitem yet</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Create menuitem to show them guests!
              </div>
              <div className="mt-4">
                <Button type="button" onClick={() => onOpenNewMenuItem()}>
                  Create MenuItem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : visibleMenuItems.length === 0 ? (
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
                    setAvailabilityFilter("all");
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
          <div className="space-y-2">
            {visibleMenuItems.map((item) => {
              const categories = item.menuCategoryMenuItems
                .map((c) => c.menuCategory.name)
                .filter(Boolean);

              if (item.imageType === "BASE_IMAGE") {
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-lg border bg-background px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
                        {item.baseImage ? (
                          <Image
                            src={item.baseImage}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                            priority={false}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ImageIcon className="size-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {item.name}
                        </div>
                        {categories.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {categories.slice(0, 3).map((c) => (
                              <span
                                key={`${item.id}-${c}`}
                                className="inline-flex items-center rounded-md border bg-background px-1.5 py-0.5 text-[0.7rem] text-muted-foreground"
                              >
                                {c}
                              </span>
                            ))}
                            {categories.length > 3 ? (
                              <span className="text-[0.7rem] text-muted-foreground">
                                +{categories.length - 3}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <div className="mt-1 text-[0.7rem] text-muted-foreground">
                            Uncategorized
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                        <TableOfContents className="size-3.5" />
                        Base
                      </span>

                      <div className="text-right">
                        <div className="text-sm font-semibold tabular-nums">
                          {formatMoney(Number(item.price))}
                        </div>
                        <div className="mt-1">
                          <AvailabilityPill isAvailable={item.isAvailable} />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="hidden w-27.5 sm:inline-flex hover:bg-muted-foreground/10"
                        onClick={() => viewMenuDetails(item.id)}
                      >
                        <Eye className="mr-1.5 size-3.5" />
                        View details
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <Accordion
                  key={item.id}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value={item.id} className="border-b-0">
                    <div className="rounded-lg border bg-background">
                      <AccordionTrigger className="px-3 py-2 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                        <div className="flex flex-col gap-2 bg-background w-full sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground ring-1 ring-foreground/10">
                              <Layers className="size-5" />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">
                                {item.name}
                              </div>

                              {categories.length > 0 ? (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {categories.slice(0, 3).map((c) => (
                                    <span
                                      key={`${item.id}-${c}`}
                                      className="inline-flex items-center rounded-md border bg-background px-1.5 py-0.5 text-[0.7rem] text-muted-foreground"
                                    >
                                      {c}
                                    </span>
                                  ))}

                                  {categories.length > 3 && (
                                    <span className="text-[0.7rem] text-muted-foreground">
                                      +{categories.length - 3}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="mt-1 text-[0.7rem] text-muted-foreground">
                                  Uncategorized
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                              <Layers className="size-3.5" />
                              <span>
                                {item.menuItemVariantOptions.length} variant
                                {item.menuItemVariantOptions.length === 1
                                  ? ""
                                  : "s"}
                              </span>
                            </span>

                            <div className="text-right">
                              <div className="text-sm font-semibold tabular-nums">
                                {formatMoney(Number(item.price))}
                              </div>
                              <div className="mt-1">
                                <AvailabilityPill
                                  isAvailable={item.isAvailable}
                                />
                              </div>
                            </div>

                            <span className="hidden w-27.5 border sm:inline-flex justify-between py-1 px-2 text-xs items-center rounded-md">
                              <Ellipsis className="size-3.5 mr-1.5" />
                              View More
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-3 pb-3 pt-2">
                        {item.menuItemVariantOptions.length === 0 ? (
                          <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                            No variant options.
                          </div>
                        ) : (
                          <ol className="space-y-2">
                            {item.menuItemVariantOptions.map((opt, idx) => (
                              <li
                                key={opt.variantOption.id}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2"
                              >
                                <div className="flex-1 flex items-center justify-between">
                                  <div className="flex min-w-0 items-start gap-2">
                                    <div className="mt-0.5 w-5 shrink-0 text-right text-xs text-muted-foreground">
                                      {idx + 1}.
                                    </div>
                                    <div className="min-w-0">
                                      <div className="truncate text-sm font-medium">
                                        {opt.variantOption.name}
                                      </div>
                                      <div className="mt-0.5 text-xs text-muted-foreground">
                                        Display order:{" "}
                                        {opt.variantOption.displayOrder}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="shrink-0 text-right">
                                    <div className="text-sm font-semibold tabular-nums">
                                      {formatMoney(
                                        Number(opt.variantOption.price),
                                      )}
                                    </div>
                                    <div className="mt-1">
                                      <AvailabilityPill
                                        isAvailable={
                                          opt.variantOption.isAvailable
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="mr-2"
                                  onClick={() =>
                                    viewMenuDetails(
                                      item.id,
                                      opt.variantOption.id,
                                    )
                                  }
                                >
                                  <ChevronRight className="size-5" />
                                </div>
                              </li>
                            ))}
                          </ol>
                        )}
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuItemPage;
