// http://localhost:3000/admin/admin/menu-items?menuItemId=cmooiryiq000bv67yfptwoy38&variantId=cmooin7sx0005v67y2lwm8jb3
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, ImageOff, Star } from "lucide-react";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { allowedUserRole } from "@/lib";
import { cn } from "@/lib/utils";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/admin/menu/pill";

function formatMoney(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
  }).format(safe);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function normalizeSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function AvailabilityPill({ isAvailable }: { isAvailable: boolean }) {
  return (
    <Pill
      className={cn(
        "border-transparent ring-1 ring-inset",
        isAvailable
          ? "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300"
          : "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-300",
      )}
    >
      <span
        className={cn(
          "mr-1.5 inline-block size-1.5 rounded-full",
          isAvailable ? "bg-emerald-500" : "bg-rose-500",
        )}
      />
      {isAvailable ? "Available" : "Unavailable"}
    </Pill>
  );
}

function RatingStars({
  ratingAverage,
  ratingCount,
}: {
  ratingAverage: number;
  ratingCount: number;
}) {
  const safeAverage = Number.isFinite(ratingAverage) ? ratingAverage : 0;
  const filled = Math.max(0, Math.min(5, Math.round(safeAverage)));

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => {
          const on = idx < filled;
          return (
            <Star
              key={idx}
              className={cn(
                "size-4",
                on
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40",
              )}
            />
          );
        })}
      </div>
      <div className="text-muted-foreground">
        {ratingCount > 0 ? (
          <>
            <span className="text-foreground">{safeAverage.toFixed(1)}</span>{" "}
            <span>({ratingCount})</span>
          </>
        ) : (
          <span>No ratings yet</span>
        )}
      </div>
    </div>
  );
}

function AccessCard({ reason }: { reason: "unauthenticated" | "forbidden" }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Menu item</CardTitle>
      </CardHeader>
      <CardContent className="py-10 text-sm text-muted-foreground">
        {reason === "unauthenticated" ? (
          <div className="space-y-3">
            <div>You need to sign in to view this page.</div>
            <Button asChild size="sm">
              <Link href="/auth/signin">Go to sign in</Link>
            </Button>
          </div>
        ) : (
          <div>You don&apos;t have permission to view this menu item.</div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function MenuItemDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ variantId?: string | string[] }>;
}) {
  const { slug } = await params;
  const paraVid = (await searchParams) ?? {};
  console.log("slub: ", slug);
  console.log("vria: ", paraVid);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <AdminLayout>
        <AccessCard reason="unauthenticated" />
      </AdminLayout>
    );
  }

  const isAllowed =
    session.user.role === allowedUserRole.ADMIN ||
    session.user.role === allowedUserRole.SUBADMIN;

  if (!isAllowed) {
    return (
      <AdminLayout>
        <AccessCard reason="forbidden" />
      </AdminLayout>
    );
  }

  const variantId = normalizeSearchParam(paraVid.variantId);

  const menuItem = await prisma.menuItem.findUnique({
    where: { id: slug },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      isAvailable: true,
      displayOrder: true,
      ratingAverage: true,
      ratingCount: true,
      imageType: true,
      baseImage: true,
      createdAt: true,
      updatedAt: true,
      menuCategoryMenuItems: {
        select: {
          menuCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      menuItemAddonCategories: {
        select: {
          addonCategory: {
            select: {
              id: true,
              name: true,
              isAvailable: true,
            },
          },
        },
      },
      menuItemVariantOptions: {
        select: {
          variantOption: {
            select: {
              id: true,
              name: true,
              price: true,
              isAvailable: true,
              displayOrder: true,
            },
          },
          variantImage: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  if (!menuItem) notFound();

  const categories = menuItem.menuCategoryMenuItems
    .map((c) => c.menuCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  const addonCategories = menuItem.menuItemAddonCategories
    .map((a) => a.addonCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  const variants = [...menuItem.menuItemVariantOptions].sort((a, b) => {
    const ao = a.variantOption.displayOrder ?? 0;
    const bo = b.variantOption.displayOrder ?? 0;
    if (ao !== bo) return ao - bo;
    return a.variantOption.name.localeCompare(b.variantOption.name);
  });

  const selectedVariant =
    variants.find((v) => v.variantOption.id === variantId) ?? null;

  const heroImageUrl =
    menuItem.imageType === "BASE_IMAGE"
      ? menuItem.baseImage
      : (selectedVariant?.variantImage?.[0]?.url ??
        variants.find((v) => v.variantImage.length > 0)?.variantImage?.[0]
          ?.url ??
        null);

  const basePrice = menuItem.price.toNumber();

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/menu-items">
              <ArrowLeft className="mr-1.5 size-4" />
              Back to menu items
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <AvailabilityPill isAvailable={menuItem.isAvailable} />
            <Pill className="bg-muted text-muted-foreground">
              Image:{" "}
              <span className="ml-1 font-medium text-foreground">
                {menuItem.imageType === "BASE_IMAGE" ? "Base" : "Variant"}
              </span>
            </Pill>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[360px_1fr]">
            <div className="relative min-h-[220px] bg-muted md:min-h-[320px]">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={menuItem.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <div className="grid size-12 place-items-center rounded-full bg-background ring-1 ring-foreground/10">
                    <ImageOff className="size-5" />
                  </div>
                  <div className="text-sm">No image</div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-wide text-muted-foreground">
                    Menu Item
                  </div>
                  <div className="text-xl font-semibold leading-tight md:text-2xl">
                    {menuItem.name}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Base price
                    </div>
                    <div className="mt-1 text-base font-semibold">
                      {formatMoney(basePrice)}
                    </div>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Rating
                    </div>
                    <div className="mt-1">
                      <RatingStars
                        ratingAverage={menuItem.ratingAverage}
                        ratingCount={menuItem.ratingCount}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Description
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-foreground">
                    {menuItem.description?.trim() ? (
                      menuItem.description
                    ) : (
                      <span className="text-muted-foreground">
                        No description provided.
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl border bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Categories
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {categories.length ? (
                        categories.map((c) => <Pill key={c.id}>{c.name}</Pill>)
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No categories linked.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Add-on categories
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {addonCategories.length ? (
                        addonCategories.map((a) => (
                          <Pill
                            key={a.id}
                            className={cn(
                              !a.isAvailable &&
                                "border-rose-600/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
                            )}
                          >
                            {a.name}
                          </Pill>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No add-on categories linked.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Variants
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {variants.length
                          ? "Pick a variant to preview price & image."
                          : "No variants linked."}
                      </div>
                    </div>

                    {variants.length > 0 && (
                      <Pill className="bg-background text-muted-foreground">
                        Selected:{" "}
                        <span className="ml-1 font-medium text-foreground">
                          {selectedVariant
                            ? selectedVariant.variantOption.name
                            : "None"}
                        </span>
                      </Pill>
                    )}
                  </div>

                  {variants.length > 0 && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {variants.map((v) => {
                        const isSelected =
                          selectedVariant?.variantOption.id ===
                          v.variantOption.id;
                        const variantPrice = v.variantOption.price.toNumber();
                        const href = `/admin/menu-items/${menuItem.id}?variantId=${encodeURIComponent(
                          v.variantOption.id,
                        )}`;

                        return (
                          <Link
                            key={v.variantOption.id}
                            href={href}
                            className={cn(
                              "group flex items-center justify-between gap-3 rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50",
                              isSelected &&
                                "border-primary/30 bg-primary/5 hover:bg-primary/5",
                            )}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="truncate text-sm font-medium">
                                  {v.variantOption.name}
                                </div>
                                {!v.variantOption.isAvailable && (
                                  <Pill className="border-rose-600/20 bg-rose-500/10 text-rose-700 dark:text-rose-300">
                                    Unavailable
                                  </Pill>
                                )}
                                {v.variantImage.length > 0 && (
                                  <Pill className="bg-muted text-muted-foreground">
                                    Image
                                  </Pill>
                                )}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                Variant price:{" "}
                                <span className="font-medium text-foreground">
                                  {formatMoney(variantPrice)}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 text-xs text-muted-foreground">
                              {isSelected ? "Viewing" : "View"}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      ID
                    </div>
                    <div className="mt-1 break-all font-mono text-xs text-foreground">
                      {menuItem.id}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Meta
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <div>
                        Display order:{" "}
                        <span className="font-medium text-foreground">
                          {menuItem.displayOrder}
                        </span>
                      </div>
                      <div>
                        Updated:{" "}
                        <span className="font-medium text-foreground">
                          {formatDateTime(menuItem.updatedAt)}
                        </span>
                      </div>
                      <div>
                        Created:{" "}
                        <span className="font-medium text-foreground">
                          {formatDateTime(menuItem.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
