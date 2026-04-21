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
      orderBy: { createdAt: "asc", displayOrder: "asc" },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const serializedMenuItems = menuItems.map((menuItem) => ({
      ...menuItem,
      price: menuItem.price.toNumber(),
      createdAt: menuItem.createdAt.toISOString(),
      updatedAt: menuItem.updatedAt.toISOString(),
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
      message: "Fetched menuitems successfully!",
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
    const isValid = menuItemFormSchema.safeParse(data);
    if (isValid.error)
      return { error: isValid.error.message, data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };

    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    let response;
    if (data.imageFile) {
      response = await utapi.uploadFiles(data.imageFile);
    }
    if (response?.error)
      return { error: response.error.message, data: null, message: null };

    const newMenuItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        price: data.price as number,
        description: data.description,
        displayOrder: data.displayOrder as number,
        categoryId: "",
      },
    });
    return;
  } catch {
    return { error: "Failed to create menu item.", data: null, message: null };
  }
};
