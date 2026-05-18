"use server";

import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types/shared/api-response";

type CustomerMenuRoom = {
  id: string;
  name: string;
  roomQR: string;
  type: string;
  floor: string;
  imgUrl: string | null;
};

type CustomerMenuVariantImage = {
  id: string;
  url: string;
};

type CustomerMenuVariantOption = {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
  isAvailable: boolean;
};

type CustomerMenuVariantLink = {
  id: string;
  variantOption: CustomerMenuVariantOption;
  variantImage: CustomerMenuVariantImage[];
};

type CustomerMenuAddon = {
  id: string;
  name: string;
  price: number;
  status: "FREE" | "PAID";
};

type CustomerMenuAddonCategory = {
  id: string;
  name: string;
  displayOrder: number;
  addons: CustomerMenuAddon[];
};

type CustomerMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  baseImage: string | null;
  imageType: "BASE_IMAGE" | "VARIANT_IMAGE";
  ratingAverage: number;
  ratingCount: number;
  variantLinks: CustomerMenuVariantLink[];
  addonCategories: CustomerMenuAddonCategory[];
};

type CustomerMenuCategory = {
  id: string;
  name: string;
  displayOrder: number;
  items: CustomerMenuItem[];
};

type CustomerMenuData = {
  room: CustomerMenuRoom;
  categories: CustomerMenuCategory[];
};

export const getMenuItemsForCustomers = async ({
  room,
  roomQR,
}: {
  room: string;
  roomQR: string;
}): Promise<ApiResponse<CustomerMenuData>> => {
  if (!room || !roomQR) {
    return {
      message: null,
      data: null,
      error: "Missing required parameters: room and roomQR.",
    };
  }

  try {
    const roomRecord = await prisma.room.findFirst({
      where: {
        roomQR: roomQR,
      },
      select: {
        id: true,
        name: true,
        roomQR: true,
        type: true,
        floor: true,
        imgUrl: true,
      },
    });

    if (!roomRecord) {
      return {
        message: null,
        data: null,
        error: "Invalid room / QR combination.",
      };
    }

    const categories = await prisma.menuCategory.findMany({
      where: { isAvailable: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        displayOrder: true,
        menuCategoryMenuItems: {
          where: {
            menuItem: { isAvailable: true },
          },
          select: {
            createdAt: true,
            menuItem: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                displayOrder: true,
                baseImage: true,
                imageType: true,
                ratingAverage: true,
                ratingCount: true,
                menuItemVariantOptions: {
                  where: {
                    variantOption: { isAvailable: true },
                  },
                  select: {
                    id: true,
                    createdAt: true,
                    variantOption: {
                      select: {
                        id: true,
                        name: true,
                        price: true,
                        displayOrder: true,
                        isAvailable: true,
                      },
                    },
                    variantImage: {
                      select: { id: true, url: true },
                    },
                  },
                },
                menuItemAddonCategories: {
                  where: {
                    addonCategory: { isAvailable: true },
                  },
                  select: {
                    createdAt: true,
                    addonCategory: {
                      select: {
                        id: true,
                        name: true,
                        displayOrder: true,
                        addons: {
                          orderBy: { createdAt: "asc" },
                          select: {
                            id: true,
                            name: true,
                            price: true,
                            status: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const serializeMenuItem = (menuItem: {
      id: string;
      name: string;
      description: string | null;
      price: { toNumber: () => number };
      displayOrder: number;
      baseImage: string | null;
      imageType: "BASE_IMAGE" | "VARIANT_IMAGE";
      ratingAverage: number;
      ratingCount: number;
      menuItemVariantOptions: Array<{
        id: string;
        createdAt: Date;
        variantOption: {
          id: string;
          name: string;
          price: { toNumber: () => number };
          displayOrder: number;
          isAvailable: boolean;
        };
        variantImage: Array<{ id: string; url: string }>;
      }>;
      menuItemAddonCategories: Array<{
        createdAt: Date;
        addonCategory: {
          id: string;
          name: string;
          displayOrder: number;
          addons: Array<{
            id: string;
            name: string;
            price: { toNumber: () => number };
            status: "FREE" | "PAID";
          }>;
        };
      }>;
    }): CustomerMenuItem => {
      const variantLinks = menuItem.menuItemVariantOptions
        .slice()
        .sort((a, b) => {
          const byOrder =
            a.variantOption.displayOrder - b.variantOption.displayOrder;
          if (byOrder !== 0) return byOrder;
          return a.createdAt.getTime() - b.createdAt.getTime();
        })
        .map((link) => ({
          id: link.id,
          variantOption: {
            ...link.variantOption,
            price: link.variantOption.price.toNumber(),
          },
          variantImage: link.variantImage,
        }));

      const addonCategories = menuItem.menuItemAddonCategories
        .slice()
        .sort((a, b) => {
          const byOrder =
            a.addonCategory.displayOrder - b.addonCategory.displayOrder;
          if (byOrder !== 0) return byOrder;
          return a.createdAt.getTime() - b.createdAt.getTime();
        })
        .map((link) => ({
          id: link.addonCategory.id,
          name: link.addonCategory.name,
          displayOrder: link.addonCategory.displayOrder,
          addons: link.addonCategory.addons.map((addon) => ({
            id: addon.id,
            name: addon.name,
            price: addon.price.toNumber(),
            status: addon.status,
          })),
        }));

      return {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price.toNumber(),
        displayOrder: menuItem.displayOrder,
        baseImage: menuItem.baseImage,
        imageType:
          menuItem.imageType === "BASE_IMAGE" ? "BASE_IMAGE" : "VARIANT_IMAGE",
        ratingAverage: menuItem.ratingAverage,
        ratingCount: menuItem.ratingCount,
        variantLinks,
        addonCategories,
      };
    };

    const serializedCategories: CustomerMenuCategory[] = categories
      .map((category) => {
        const items = category.menuCategoryMenuItems
          .slice()
          .sort((a, b) => {
            const byOrder = a.menuItem.displayOrder - b.menuItem.displayOrder;
            if (byOrder !== 0) return byOrder;
            return a.createdAt.getTime() - b.createdAt.getTime();
          })
          .map((link) => serializeMenuItem(link.menuItem));

        return {
          id: category.id,
          name: category.name,
          displayOrder: category.displayOrder,
          items,
        };
      })
      .filter((c) => c.items.length > 0);

    return {
      message: "Fetched menu items for customers.",
      data: {
        room: roomRecord,
        categories: serializedCategories,
      },
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch menu items for customers.", error);

    return {
      message: null,
      data: null,
      error: "Failed to fetch menu items for customers.",
    };
  }
};
