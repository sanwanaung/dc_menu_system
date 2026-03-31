"use server";

import * as z from "zod";
import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { menuCategoryFormSchema } from "@/schemas/menu-category";
import { revalidatePath } from "next/cache";

type FormInput = z.input<typeof menuCategoryFormSchema>;

export const getMenuCategories = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const menuCategories = await prisma.menuCategory.findMany();
    const available = await prisma.menuCategory.count({
      where: { isAvailable: true },
    });
    const unavailable = await prisma.menuCategory.count({
      where: { isAvailable: false },
    });
    const datas = { menuCategories, available, unavailable };
    return { data: datas, message: "" };
  } catch {
    return { error: "Failed to fetch menuCategories!" };
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

export const createNewMenuCategory = async (data: FormInput) => {
  try {
    if (
      !data.name ||
      typeof data.displayOrder !== "number" ||
      data.displayOrder < 0 ||
      typeof data.isAvailable !== "boolean"
    ) {
      return { error: "Bad Request" };
    }
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!" };
    const newMenuCategory = await prisma.menuCategory.create({
      data: {
        name: data.name,
        displayOrder: data.displayOrder as number,
        isAvailable: data.isAvailable,
      },
    });
    revalidatePath("/admin/menu-categories", "page");
    return { data: newMenuCategory, message: "New MenuCategory is added!" };
  } catch (error) {
    console.log("error in create room: ", error);
    return { error: "Failed to create menucategory" };
  }
};

export const updateAvailable = async (id: string) => {
  try {
    if (!id) return { error: "Bad Request" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!" };
    const isFound = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isFound) return { error: "No data is Found!" };
    const updatedMenuCategory = await prisma.menuCategory.update({
      data: {
        isAvailable: !isFound.isAvailable,
      },
      where: {
        id,
      },
    });
    revalidatePath("/admin/menu-categories", "page");
    return {
      data: updatedMenuCategory,
      message: "Availablity is successfully changed!",
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return { error: "Failed to update menucategory" };
  }
};

export const updateMenuCategory = async (id: string, data: FormInput) => {
  try {
    if (!id && !data) return { error: "Bad Request" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!" };
    const isFound = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isFound) return { error: "No data is Found!" };
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
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return { error: "Failed to update menucategory" };
  }
};

export const deleteMenuCategory = async (id: string) => {
  try {
    if (!id) return { error: "Bad Request" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!" };
    const isFound = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isFound) return { error: "No data is Found!" };
    await prisma.menuCategory.delete({
      where: {
        id,
      },
    });
    revalidatePath("/admin/menu-categories", "page");
    return {
      data: null,
      message: "Deleted Successfully!",
    };
  } catch (error) {
    console.log("error in create room: ", error);
    return { error: "Failed to delete menucategory" };
  }
};
