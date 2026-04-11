"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  GetUserResponse,
  GetUsersResponse,
  UpdateUserRoleResponse,
} from "@/types/user";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getUsers = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetUsersResponse> => {
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
    const rowsCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      take: limitNum,
      skip: offsetNum * limitNum,
      orderBy: {
        createdAt: "asc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });
    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    const serializeUsers = users.map((u) => {
      return {
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.createdAt.toISOString(),
      };
    });

    return {
      data: {
        items: serializeUsers,
        meta: {
          pageCount,
          total: rowsCount,
          nextPage,
          previousPage,
        },
      },
      message: "Fetched Successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to fetch users!", data: null, message: null };
  }
};

export const getUser = async (id: string): Promise<GetUserResponse> => {
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
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) return { error: "Not Found!", data: null, message: null };
    return { data: user, message: "Fetched Successfully!", error: null };
  } catch {
    return { error: "Failed to fetch user!", data: null, message: null };
  }
};

export const updateUserRole = async (
  id: string,
  role: string,
): Promise<UpdateUserRoleResponse> => {
  try {
    if (!id || !role)
      return { error: "Bad Request!", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) return { error: "Not Found!", data: null, message: null };
    await prisma.user.update({
      data: {
        role,
      },
      where: {
        id,
      },
    });
    return { data: null, message: "Role have been changed!", error: null };
  } catch {
    return { error: "Failed to update user role!", data: null, message: null };
  }
};
