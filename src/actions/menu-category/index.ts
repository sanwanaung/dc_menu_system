"use server";

import * as z from "zod";
import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { menuCategoryFormSchema } from "@/schemas/menu-category";
import { revalidatePath } from "next/cache";
import {
  CreateMenuCategoryResponse,
  DeleteMenuCategoryResponse,
  GetMenuCategoriesForMenuItemResponse,
  GetMenuCategoriesResponse,
  UpdateAvailabilityResponse,
  UpdateMenuCategoryResponse,
} from "@/types/menu-category";

type FormInput = z.input<typeof menuCategoryFormSchema>;

export const getMenuCategories = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetMenuCategoriesResponse> => {
  try {
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", message: null, data: null };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const rowsCount = await prisma.menuCategory.count();
    const menuCategories = await prisma.menuCategory.findMany({
      take: limitNum,
      skip: offsetNum * limitNum,
      orderBy: {
        displayOrder: "asc",
      },
    });

    const serializeMenuCategories = menuCategories.map((item) => {
      return {
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    });

    const available = await prisma.menuCategory.count({
      where: { isAvailable: true },
    });
    const unavailable = await prisma.menuCategory.count({
      where: { isAvailable: false },
    });

    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    return {
      data: {
        items: serializeMenuCategories,
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
      message: "Fetched Successfully!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to fetch menuCategories!",
      data: null,
      message: null,
    };
  }
};

export const getMenuCategoriesForMenu =
  async (): Promise<GetMenuCategoriesForMenuItemResponse> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session)
        return { error: "No Authorization!", message: null, data: null };
      const isAllowed =
        session.user.role === allowedUserRole.ADMIN ||
        session.user.role === allowedUserRole.SUBADMIN;
      if (!isAllowed)
        return {
          error: "You don't have permission!",
          data: null,
          message: null,
        };
      const menuCategories = await prisma.menuCategory.findMany({
        where: { isAvailable: true },
        orderBy: {
          displayOrder: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });

      return {
        data: menuCategories,
        message: "Fetched Successfully!",
        error: null,
      };
    } catch {
      return {
        error: "Failed to fetch menuCategories!",
        data: null,
        message: null,
      };
    }
  };

export const getMenuCategory = async (id: string) => {
  try {
    if (!id) return { error: "Bad Request" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const menuCategory = await prisma.menuCategory.findFirst({
      where: { id },
    });
    if (!menuCategory) return { error: "No data is found!" };
    return { data: menuCategory, message: "" };
  } catch {
    return { error: "Failed to fetch menuCategory!" };
  }
};

export const createNewMenuCategory = async (
  data: FormInput,
): Promise<CreateMenuCategoryResponse> => {
  try {
    if (
      !data.name ||
      typeof data.displayOrder !== "number" ||
      data.displayOrder < 0 ||
      typeof data.isAvailable !== "boolean"
    ) {
      return { error: "Bad Request", data: null, message: null };
    }
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };
    const newMenuCategory = await prisma.menuCategory.create({
      data: {
        name: data.name,
        displayOrder: data.displayOrder as number,
        isAvailable: data.isAvailable,
      },
    });
    return {
      data: newMenuCategory,
      message: "New MenuCategory is added!",
      error: null,
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return {
      error: "Failed to create menucategory",
      data: null,
      message: null,
    };
  }
};

export const updateAvailablility = async (
  id: string,
): Promise<UpdateAvailabilityResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };
    const isFound = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isFound)
      return { error: "No data is Found!", data: null, message: null };
    const updatedMenuCategory = await prisma.menuCategory.update({
      data: {
        isAvailable: !isFound.isAvailable,
      },
      where: {
        id,
      },
    });
    return {
      data: updatedMenuCategory,
      message: "Availablity is successfully changed!",
      error: null,
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return {
      error: "Failed to update menucategory",
      data: null,
      message: null,
    };
  }
};

export const updateMenuCategory = async (
  id: string,
  data: FormInput,
): Promise<UpdateMenuCategoryResponse> => {
  try {
    if (!id && !data)
      return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };
    const isFound = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isFound)
      return { error: "No data is Found!", data: null, message: null };
    const updatedMenuCategory = await prisma.menuCategory.update({
      data: {
        isAvailable: data.isAvailable,
        name: data.name,
        displayOrder: data.displayOrder as number,
      },
      where: {
        id,
      },
    });
    revalidatePath("/admin/menu-categories", "page");
    return {
      data: updatedMenuCategory,
      message: "Updated Successfully!",
      error: null,
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return {
      error: "Failed to update menucategory",
      data: null,
      message: null,
    };
  }
};

export const deleteMenuCategory = async (
  id: string,
): Promise<DeleteMenuCategoryResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };
    const isFound = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isFound)
      return { error: "No data is Found!", data: null, message: null };
    await prisma.menuCategory.delete({
      where: {
        id,
      },
    });
    return {
      data: null,
      message: "Deleted Successfully!",
      error: null,
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return {
      error: "Failed to delete menucategory",
      data: null,
      message: null,
    };
  }
};
