"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FormInput, menuItemFormSchema } from "@/schemas/menu-item";
import {
  CreateNewMenuItemResponse,
  GetMenuItemsResponse,
} from "@/types/menu-item";
import { headers } from "next/headers";
import { utapi } from "@/actions/uploadthing";

export const getMenuItems = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetMenuItemsResponse> => {
  try {
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };

    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;

    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };

    const rowsCount = await prisma.menuItem.count();
    const menuItems = await prisma.menuItem.findMany({
      take: limitNum,
      skip: offsetNum * limitNum,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        baseImage: true,
        imageType: true,
        updatedAt: true,
        price: true,
        isAvailable: true,
        displayOrder: true,
        name: true,
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
          },
          where: {
            variantOption: {
              isAvailable: true,
            },
          },
        },
      },
    });

    const serializedMenuItems = menuItems.map((menuItem) => ({
      ...menuItem,
      price: menuItem.price.toNumber(),
      updatedAt: menuItem.updatedAt.toISOString(),

      menuItemVariantOptions: menuItem.menuItemVariantOptions.map((v) => ({
        ...v,
        variantOption: {
          ...v.variantOption,
          price: v.variantOption.price.toNumber(),
        },
      })),
    }));

    const [available, unavailable] = await prisma.$transaction([
      prisma.menuItem.count({ where: { isAvailable: true } }),
      prisma.menuItem.count({ where: { isAvailable: false } }),
    ]);

    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    return {
      data: {
        items: serializedMenuItems,
        meta: {
          total: rowsCount,
          nextPage,
          previousPage,
          pageCount,
        },
        summary: {
          available,
          unavailable,
        },
      },
      message: "Fetched menu-items successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to fetch menuitems!", data: null, message: null };
  }
};

export const createNewMenuItem = async ({
  data,
}: {
  data: FormInput;
}): Promise<CreateNewMenuItemResponse> => {
  try {
    const parsed = menuItemFormSchema.safeParse(data);
    if (!parsed.success) {
      return {
        error: parsed.error.message,
        data: null,
        message: null,
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { error: "No Authorization!", data: null, message: null };
    }
    if (session.user.role !== allowedUserRole.ADMIN) {
      return {
        error: "You don't have permission!",
        data: null,
        message: null,
      };
    }

    let baseImageUrl: string | null = null;
    if (data.imageFile) {
      const upload = await utapi.uploadFiles(data.imageFile);

      if (upload?.error) {
        return {
          error: upload.error.message,
          data: null,
          message: null,
        };
      }
      baseImageUrl = upload.data?.ufsUrl ?? null;
    }

    const menu = await prisma.$transaction(async (tx) => {
      const menuItem = await tx.menuItem.create({
        data: {
          name: data.name,
          price: Number(data.price),
          isAvailable: data.isAvailable,
          displayOrder: data.displayOrder as number | undefined,
          description: data.description,
          baseImage: data.imageType === "BASE_IMAGE" ? baseImageUrl : null,
          imageType:
            data.imageType === "BASE_IMAGE" ? "BASE_IMAGE" : "VARIANT_IMAGE",
        },
        select: {
          id: true,
          baseImage: true,
          imageType: true,
          updatedAt: true,
          price: true,
          isAvailable: true,
          displayOrder: true,
          name: true,
        },
      });

      if (data.menuCategories.length > 0) {
        await tx.menuCategoryMenuItem.createMany({
          data: data.menuCategories.map((c) => ({
            menuItemId: menuItem.id,
            menuCategoryId: c.value,
          })),
        });
      }

      if (data.variantOptions && data.variantOptions.length > 0) {
        for (const variant of data.variantOptions) {
          const link = await tx.menuItemVariantOption.create({
            data: {
              menuItemId: menuItem.id,
              variantOptionId: variant.value,
            },
          });

          if (data.imageType === "VARIANT_IMAGE" && baseImageUrl) {
            await tx.variantImage.create({
              data: {
                menuItemVariantOptionId: link.id,
                url: baseImageUrl,
              },
            });
          }
        }
      }

      if (data.addonCategories.length > 0) {
        await tx.menuItemAddonCategory.createMany({
          data: data.addonCategories.map((a) => ({
            menuItemId: menuItem.id,
            addonCategoryId: a.value,
          })),
        });
      }

      return menuItem;
    });

    const serializeMenuItem = {
      ...menu,
      updatedAt: menu.updatedAt.toISOString(),
      price: Number(menu.price),
    };

    return {
      data: serializeMenuItem,
      message: "Menu item created successfully!",
      error: null,
    };
  } catch (err) {
    console.error(err);

    return {
      error: "Failed to create menu item.",
      data: null,
      message: null,
    };
  }
};
