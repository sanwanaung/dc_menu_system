"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FormInput } from "@/schemas/addon";
import { CreateAddonResponse, GetAddonsResponse } from "@/types/addon";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createNewAddon = async (
  data: FormInput,
): Promise<CreateAddonResponse> => {
  try {
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
    revalidatePath("/admin/addons", "page");
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

    const [free, paid] = await Promise.all([
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
      message: "Addons fetched successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to fetch addons!", data: null, message: null };
  }
};
