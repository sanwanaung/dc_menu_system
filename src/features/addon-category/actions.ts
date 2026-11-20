"use server";

import * as z from "zod";
import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { addonCategoryFormSchema } from "@/features/addon-category/schema";
import {
  CreateNewAddonCategoryResponse,
  DeleteAddonCategoryResponse,
  GetAddonCategoriesForMenuResponse,
  GetAddonCategoriesResponse,
  GetAddonCategoryResponse,
  GetAvailableAddonCategoriesByIdResponse,
  GetAvailableAddonCategoriesResponse,
  UpdateAddonCategoryAvailabilityResponse,
  UpdateAddonCategoryResponse,
} from "@/features/addon-category/types";

type FormInput = z.input<typeof addonCategoryFormSchema>;

export const getAddonCategories = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetAddonCategoriesResponse> => {
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
      return {
        error: "You don't have permission!",
        data: null,
        message: null,
      };

    const rowsCount = await prisma.addonCategory.count();
    const addonCategories = await prisma.addonCategory.findMany({
      take: limitNum,
      skip: offsetNum * limitNum,
      orderBy: {
        displayOrder: "asc",
      },
    });

    const available = await prisma.addonCategory.count({
      where: { isAvailable: true },
    });

    const unavailable = await prisma.addonCategory.count({
      where: { isAvailable: false },
    });

    const serializeAddonCategories = addonCategories.map((addonCategory) => ({
      ...addonCategory,
      createdAt: addonCategory.createdAt.toISOString(),
      updatedAt: addonCategory.updatedAt.toISOString(),
    }));

    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    return {
      data: {
        items: serializeAddonCategories,
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
      message: "Fetched successfully!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to fetch addoncategories!",
      data: null,
      message: null,
    };
  }
};

export const createNewAddonCategory = async (
  data: FormInput,
): Promise<CreateNewAddonCategoryResponse> => {
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
    const newAddonCategory = await prisma.addonCategory.create({
      data: {
        name: data.name,
        displayOrder: data.displayOrder as number,
        isAvailable: data.isAvailable,
      },
    });
    revalidatePath("/admin/addon-categories", "page");
    return {
      data: newAddonCategory,
      message: "New AddonCategory is added!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to create addonCategory",
      data: null,
      message: null,
    };
  }
};

export const updateAvailable = async (
  id: string,
): Promise<UpdateAddonCategoryAvailabilityResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };
    const isFound = await prisma.addonCategory.findFirst({ where: { id } });
    if (!isFound)
      return { error: "No data is Found!", data: null, message: null };
    const updatedMenuCategory = await prisma.addonCategory.update({
      data: {
        isAvailable: !isFound.isAvailable,
      },
      where: {
        id,
      },
    });
    revalidatePath("/admin/addon-categories", "page");
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

export const updateAddonCategory = async (
  id: string,
  data: FormInput,
): Promise<UpdateAddonCategoryResponse> => {
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
    const isFound = await prisma.addonCategory.findFirst({ where: { id } });
    if (!isFound)
      return { error: "No data is Found!", data: null, message: null };
    const updatedAddonCategory = await prisma.addonCategory.update({
      data: {
        isAvailable: data.isAvailable,
        name: data.name,
        displayOrder: data.displayOrder as number,
      },
      where: {
        id,
      },
    });
    revalidatePath("/admin/addon-categories", "page");
    return {
      data: updatedAddonCategory,
      message: "Updated Successfully!",
      error: null,
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return {
      error: "Failed to update addonCategory",
      data: null,
      message: null,
    };
  }
};

export const getAddonCategory = async (
  id: string,
): Promise<GetAddonCategoryResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const addonCategory = await prisma.addonCategory.findFirst({
      where: { id },
    });
    if (!addonCategory)
      return { error: "No data is found!", data: null, message: null };
    return { data: addonCategory, message: "", error: null };
  } catch {
    return {
      error: "Failed to fetch addonCategory!",
      data: null,
      message: null,
    };
  }
};

export const getAvailableAddonCategories =
  async (): Promise<GetAvailableAddonCategoriesResponse> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session)
        return { error: "No Authorization!", data: null, message: null };
      const isAllowed = session.user.role === allowedUserRole.ADMIN;
      if (!isAllowed)
        return {
          error: "You don't have permission!",
          data: null,
          message: null,
        };
      const addonCategories = await prisma.addonCategory.findMany({
        where: { isAvailable: true },
      });
      const serializedAddonCategories = addonCategories.map((item) => {
        return {
          ...item,
          createdAt: item.createdAt.toString(),
          updatedAt: item.updatedAt.toString(),
        };
      });
      return {
        data: serializedAddonCategories,
        message: "Fetched successfully!",
        error: null,
      };
    } catch {
      return {
        data: null,
        error: "Failed to fetch addon categories",
        message: null,
      };
    }
  };

export const getAvailableAddonCategoriesById = async (
  id: string,
): Promise<GetAvailableAddonCategoriesByIdResponse> => {
  try {
    if (!id) return { error: "Bad Request!", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const addonCategories = await prisma.addonCategory.findMany({
      where: {
        isAvailable: true,
        addons: {
          none: {
            id: id,
          },
        },
      },
    });

    const serializeAddonCategories = addonCategories.map((item) => {
      return {
        ...item,
        createdAt: item.createdAt.toString(),
        updatedAt: item.updatedAt.toString(),
      };
    });
    return {
      data: serializeAddonCategories,
      message: "Fetched successfully!",
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Failed to fetch addon categories",
      message: null,
    };
  }
};

export const deleteAddonCategory = async (
  id: string,
): Promise<DeleteAddonCategoryResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };
    const isFound = await prisma.addonCategory.findFirst({ where: { id } });
    if (!isFound)
      return { error: "No data is Found!", data: null, message: null };
    await prisma.addonCategory.delete({
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

export const getAddonCategoriesForMenu =
  async (): Promise<GetAddonCategoriesForMenuResponse> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session)
        return { error: "No Authorization!", data: null, message: null };
      const isAllowed =
        session.user.role === allowedUserRole.ADMIN ||
        session.user.role === allowedUserRole.SUBADMIN;
      if (!isAllowed)
        return {
          error: "You don't have permission!",
          data: null,
          message: null,
        };
      const addonCategories = await prisma.addonCategory.findMany({
        where: {
          isAvailable: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });

      return {
        data: addonCategories,
        message: "Fetched successfully!",
        error: null,
      };
    } catch {
      return {
        error: "Failed to fetch addoncategories!",
        data: null,
        message: null,
      };
    }
  };
