"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FormInput, menuItemFormSchema } from "@/features/menu-item/schema";
import {
  CreateNewMenuItemResponse,
  GetMenuItemDetailsResponse,
  GetMenuItemsResponse,
  UpdateMenuItemResponse,
} from "@/features/menu-item/types";
import { headers } from "next/headers";
import { utapi } from "@/lib/uploadthing";
import { revalidatePath } from "next/cache";

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

      if (data.addonCategories && data.addonCategories.length > 0) {
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

export const updateMenuItem = async ({
  menuItemId,
  data,
}: {
  menuItemId: string;
  data: FormInput;
}): Promise<UpdateMenuItemResponse> => {
  try {
    if (!menuItemId) {
      return { error: "Bad Request!", data: null, message: null };
    }

    const parsed = menuItemFormSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.message, data: null, message: null };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { error: "No Authorization!", data: null, message: null };
    }
    if (session.user.role !== allowedUserRole.ADMIN) {
      return { error: "You don't have permission!", data: null, message: null };
    }

    const existing = await prisma.menuItem.findFirst({
      where: { id: menuItemId },
      select: { id: true, baseImage: true },
    });
    if (!existing) {
      return { error: "Menu item is not found!", data: null, message: null };
    }

    let uploadedUrl: string | null = null;
    if (data.imageFile) {
      const upload = await utapi.uploadFiles(data.imageFile);
      if (upload?.error) {
        return { error: upload.error.message, data: null, message: null };
      }
      uploadedUrl = upload.data?.ufsUrl ?? null;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedMenuItem = await tx.menuItem.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          price: Number(data.price),
          isAvailable: data.isAvailable,
          displayOrder: data.displayOrder as number | undefined,
          description: data.description,
          baseImage:
            data.imageType === "BASE_IMAGE"
              ? (uploadedUrl ?? existing.baseImage)
              : null,
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

      await tx.menuCategoryMenuItem.deleteMany({
        where: { menuItemId: existing.id },
      });
      if (data.menuCategories.length > 0) {
        await tx.menuCategoryMenuItem.createMany({
          data: data.menuCategories.map((c) => ({
            menuItemId: existing.id,
            menuCategoryId: c.value,
          })),
        });
      }

      await tx.menuItemAddonCategory.deleteMany({
        where: { menuItemId: existing.id },
      });
      if (data.addonCategories && data.addonCategories.length > 0) {
        await tx.menuItemAddonCategory.createMany({
          data: data.addonCategories.map((a) => ({
            menuItemId: existing.id,
            addonCategoryId: a.value,
          })),
        });
      }

      const requestedVariantOptionIds = (data.variantOptions ?? []).map(
        (v) => v.value,
      );

      const existingVariantLinks = await tx.menuItemVariantOption.findMany({
        where: { menuItemId: existing.id },
        select: { id: true, variantOptionId: true },
      });

      const requestedSet = new Set(requestedVariantOptionIds);
      const existingSet = new Set(
        existingVariantLinks.map((l) => l.variantOptionId),
      );

      const linkIdsToDelete = existingVariantLinks
        .filter((l) => !requestedSet.has(l.variantOptionId))
        .map((l) => l.id);

      if (linkIdsToDelete.length > 0) {
        await tx.menuItemVariantOption.deleteMany({
          where: { id: { in: linkIdsToDelete } },
        });
      }

      const variantOptionIdsToCreate = requestedVariantOptionIds.filter(
        (id) => !existingSet.has(id),
      );
      for (const variantOptionId of variantOptionIdsToCreate) {
        await tx.menuItemVariantOption.create({
          data: {
            menuItemId: existing.id,
            variantOptionId,
          },
        });
      }

      if (data.imageType === "VARIANT_IMAGE") {
        if (uploadedUrl) {
          const links = await tx.menuItemVariantOption.findMany({
            where: {
              menuItemId: existing.id,
              variantOptionId: { in: requestedVariantOptionIds },
            },
            select: { id: true },
          });

          for (const link of links) {
            await tx.variantImage.deleteMany({
              where: { menuItemVariantOptionId: link.id },
            });
            await tx.variantImage.create({
              data: {
                menuItemVariantOptionId: link.id,
                url: uploadedUrl,
              },
            });
          }
        }
      } else {
        await tx.variantImage.deleteMany({
          where: {
            menuItemVariantOption: {
              menuItemId: existing.id,
            },
          },
        });
      }

      return updatedMenuItem;
    });
    revalidatePath("/admin/menu-items/[slug]");
    return {
      data: {
        ...updated,
        updatedAt: updated.updatedAt.toISOString(),
        price: updated.price.toNumber(),
      },
      message: "Menu item updated successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Failed to update menu-item", error);
    return { error: "Failed to update menu item.", data: null, message: null };
  }
};

export const getMenuItemDetails = async ({
  menuItemId,
  variantId,
}: {
  menuItemId: string;
  variantId?: string;
}): Promise<GetMenuItemDetailsResponse> => {
  try {
    if (!menuItemId) {
      return { data: null, message: null, error: "Bad Request!" };
    }
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { error: "No Authorization!", data: null, message: null };
    }
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed) {
      return {
        error: "You don't have authorization for this page!",
        data: null,
        message: null,
      };
    }

    const normalizedVariantId = variantId?.trim() || undefined;

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isAvailable: true,
        displayOrder: true,
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
              },
            },
          },
        },
        menuItemVariantOptions: {
          where: {
            variantOption: {
              isAvailable: true,
            },
          },
          select: {
            id: true,
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
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!menuItem) {
      return { error: "Menu item is not found!", data: null, message: null };
    }

    const serializedVariantOptions = menuItem.menuItemVariantOptions.map(
      (link) => ({
        id: link.id,
        variantOption: {
          ...link.variantOption,
          price: link.variantOption.price.toNumber(),
        },
        variantImage: link.variantImage,
      }),
    );

    const selectedVariant =
      normalizedVariantId &&
      serializedVariantOptions.find(
        (link) => link.variantOption.id === normalizedVariantId,
      );

    return {
      data: {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price.toNumber(),
        displayOrder: menuItem.displayOrder,
        isAvailable: menuItem.isAvailable,
        baseImage: menuItem.baseImage,
        imageType:
          menuItem.imageType === "BASE_IMAGE" ? "BASE_IMAGE" : "VARIANT_IMAGE",
        createdAt: menuItem.createdAt.toISOString(),
        updatedAt: menuItem.updatedAt.toISOString(),
        menuCategoryMenuItems: menuItem.menuCategoryMenuItems,
        menuItemAddonCategories: menuItem.menuItemAddonCategories,
        menuItemVariantOptions: serializedVariantOptions,
        selectedVariant: (selectedVariant as unknown as any) ?? null,
      },
      message: "Fetched menu-item details successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch menu-item details", error);
    return {
      data: null,
      message: null,
      error: "Failed to fetch menu-item details",
    };
  }
};
