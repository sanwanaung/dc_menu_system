"use server";

import * as z from "zod";
import { utapi } from "@/actions/uploadthing";
import { allowedUserRole, generateQrFile } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createRoomSchema, editRoomSchema } from "@/schemas/rooms";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type createRoomType = z.infer<typeof createRoomSchema>;
type editRoomType = z.infer<typeof editRoomSchema>;

export const createNewRoom = async (r: createRoomType) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!" };
    const hasRoom = await prisma.room.findFirst({
      where: {
        roomQR: r.roomQR,
      },
    });
    if (hasRoom) return { error: "Duplicated room!" };
    const qrFile = await generateQrFile(r.name, r.roomQR);
    const response = await utapi.uploadFiles(qrFile);
    if (response.error) return { error: response.error.message };
    const newRoom = await prisma.room.create({
      data: {
        name: r.name,
        floor: r.floor,
        roomQR: r.roomQR,
        type: r.type,
        imgUrl: response.data?.ufsUrl,
      },
      omit: {
        imgUrl: true,
      },
    });
    revalidatePath("/admin/rooms", "page");
    return { data: newRoom, message: "New room is added!" };
  } catch (error) {
    console.log("error in create room: ", error);
    return { error: "Failed to create room" };
  }
};

export const getRooms = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const rooms = await prisma.room.findMany();
    return { data: rooms, message: "" };
  } catch {
    return { error: "Failed to fetch rooms!" };
  }
};

export const getRoom = async ({ id }: { id: string }) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const room = await prisma.room.findFirst({
      where: {
        id,
      },
    });
    return { data: room, message: "" };
  } catch {
    return { error: "Failed to fetch rooms!" };
  }
};

export const updateRoom = async (r: editRoomType, id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const room = await prisma.room.findFirst({
      where: {
        id,
      },
    });
    if (!room) return { error: "Room is not found!" };
    const updatedRoom = await prisma.room.update({
      data: {
        name: r.name,
        floor: r.floor,
        type: r.type,
        roomQR: r.roomQR,
      },
      where: {
        id: room.id,
      },
    });
    revalidatePath("/admin/rooms", "page");
    return { data: updatedRoom, message: "Your changes is successful!" };
  } catch {
    return { error: "Failed to fetch rooms!" };
  }
};

export const deleteRoom = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const room = await prisma.room.findFirst({
      where: {
        id,
      },
    });
    if (!room) return { error: "Room is not found!" };
    await prisma.room.delete({
      where: {
        roomQR: room.roomQR,
        id: room.id,
      },
    });
    revalidatePath("/admin/rooms", "page");
    return { data: null, message: "Deleting is successful!" };
  } catch {
    return { error: "Failed to fetch rooms!" };
  }
};
