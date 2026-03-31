"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getUsers = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const users = await prisma.user.findMany();
    return { data: users, message: "" };
  } catch {
    return { error: "Failed to fetch users!" };
  }
};

export const getUser = async (id: string) => {
  try {
    if (!id) return { error: "Bad Request!" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        banned: true,
        image: true,
      },
    });
    if (!user) return { error: "Not Found!" };
    return { data: user, message: "" };
  } catch {
    return { error: "Failed to fetch user!" };
  }
};

export const updateUserRole = async (id: string, role: string) => {
  try {
    if (!id || !role) return { error: "Bad Request!" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) return { error: "Not Found!" };
    await prisma.user.update({
      data: {
        role,
      },
      where: {
        id,
      },
    });
    revalidatePath("/admin/users", "page");
    return { data: null, message: "Role have been changed!" };
  } catch {
    return { error: "Failed to update user role!" };
  }
};
