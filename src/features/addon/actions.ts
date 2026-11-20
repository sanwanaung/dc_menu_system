"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FormInput } from "@/features/addon/schema";
import {
  CreateAddonResponse,
  DeleteAddonResponse,
  GetAddonResponse,
  GetAddonsResponse,
  UpdateAddonResponse,
} from "@/features/addon/types";
import { headers } from "next/headers";

export const createNewAddon = async (
  data: FormInput,
): Promise<CreateAddonResponse> => {
  try {
    console.log("data: ", data);
    if (!data.addonCategoryId)
      return { error: "Bad Request!", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const newAddon = await prisma.addon.create({
      data: {
        name: data.name,
        price: data.price as number,
        addonCategoryId: data.addonCategoryId,
        status: data.price === 0 ? "FREE" : "PAID",
      },
    });
    return {
      data: {
        ...newAddon,
        price: newAddon.price.toNumber(),
        createdAt: newAddon.createdAt.toISOString(),
        updatedAt: newAddon.updatedAt.toISOString(),
      },
      message: "New Addon is added successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to create addons!", data: null, message: null };
  }
};

export const getAddons = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetAddonsResponse> => {
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

    const rowsCount = await prisma.addon.count();
    const addons = await prisma.addon.findMany({
      take: limitNum,
      skip: offsetNum * limitNum,
      include: {
        addonCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const serializedAddons = addons.map((addon) => ({
      ...addon,
      price: addon.price.toNumber(),
      createdAt: addon.createdAt.toISOString(),
      updatedAt: addon.updatedAt.toISOString(),
      status: addon.status as "FREE" | "PAID",
    }));

    const [free, paid] = await prisma.$transaction([
      prisma.addon.count({ where: { status: "FREE" } }),
      prisma.addon.count({ where: { status: "PAID" } }),
    ]);

    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    return {
      data: {
        items: serializedAddons,
        meta: {
          total: rowsCount,
          nextPage,
          previousPage,
          pageCount,
        },
        summary: {
          free,
          paid,
        },
      },
      message: "Fetched menuitems successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to fetch addons!", data: null, message: null };
  }
};

export const getAddon = async (id: string): Promise<GetAddonResponse> => {
  try {
    if (!id) return { error: "Bad Request!", data: null, message: null };
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

    const addon = await prisma.addon.findFirst({ where: { id } });
    if (!addon) return { error: "No data found.", data: null, message: null };

    const serializeAddon = [addon].map((item) => {
      return {
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        price: item.price.toNumber(),
      };
    });

    return {
      data: serializeAddon[0],
      message: "Addons fetched successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to fetch addons!", data: null, message: null };
  }
};

export const updateAddon = async ({
  form,
  id,
}: {
  form: FormInput;
  id: string;
}): Promise<UpdateAddonResponse> => {
  try {
    if (!id || !form.name)
      return { error: "Bad Request!", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const hasAddon = await prisma.addon.findFirst({ where: { id } });
    if (!hasAddon)
      return { error: "No data found!", data: null, message: null };

    const nameChanged = form.name.trim() !== hasAddon.name;
    const categoryChanged = form.addonCategoryId !== hasAddon.addonCategoryId;
    const priceChanged = form.price !== Number(hasAddon.price);

    if (!nameChanged && !categoryChanged && !priceChanged) {
      return { error: "No changes detected.", data: null, message: null };
    }

    const updatedAddon = await prisma.addon.update({
      where: {
        id,
      },
      data: {
        name: form.name,
        addonCategoryId: form.addonCategoryId
          ? form.addonCategoryId
          : hasAddon.addonCategoryId,
        price: Number(form.price),
        status: Number(form.price) === 0 ? "FREE" : "PAID",
      },
    });

    return {
      data: {
        ...updatedAddon,
        createdAt: updatedAddon.createdAt.toISOString(),
        updatedAt: updatedAddon.updatedAt.toISOString(),
        price: Number(updatedAddon.price),
      },
      message: "New Addon is added successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to update addons!", data: null, message: null };
  }
};

export const deleteAddon = async ({
  id,
}: {
  id: string;
}): Promise<DeleteAddonResponse> => {
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
    const hasAddon = await prisma.addon.findFirst({ where: { id } });
    if (!hasAddon)
      return { error: "No data found!", data: null, message: null };

    await prisma.addon.delete({ where: { id } });

    return {
      data: null,
      message: "Deleted successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to create addons!", data: null, message: null };
  }
};
