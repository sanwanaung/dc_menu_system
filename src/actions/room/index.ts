"use server";

import * as z from "zod";
import { utapi } from "@/actions/uploadthing";
import { allowedUserRole, generateQrFile } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createRoomSchema, editRoomSchema } from "@/schemas/rooms";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  CreateRoomResponse,
  DeleteRoomResponse,
  GetRoomResponse,
  GetRoomsResponse,
  UpdateRoomResponse,
} from "@/types/room";

type createRoomType = z.infer<typeof createRoomSchema>;
type editRoomType = z.infer<typeof editRoomSchema>;

export const createNewRoom = async (
  r: createRoomType,
): Promise<CreateRoomResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };
    const hasRoom = await prisma.room.findFirst({
      where: {
        roomQR: r.roomQR,
      },
    });
    console.log("hasRoom: ", hasRoom);
    if (hasRoom)
      return { error: "Duplicated room!", data: null, message: null };
    const qrFile = await generateQrFile(r.name, r.roomQR);
    const response = await utapi.uploadFiles(qrFile);
    if (response.error)
      return { error: response.error.message, data: null, message: null };
    const newRoom = await prisma.room.create({
      data: {
        name: r.name,
        floor: r.floor,
        roomQR: r.roomQR,
        type: r.type,
        imgUrl: response.data?.ufsUrl,
      },
    });
    revalidatePath("/admin/rooms", "page");
    return { data: newRoom, message: "New room is added!", error: null };
  } catch (error) {
    console.log("error in create room: ", error);
    return { error: "Failed to create room", data: null, message: null };
  }
};

export const getRooms = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetRoomsResponse> => {
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
    const rowsCount = await prisma.room.count();
    const rooms = await prisma.room.findMany({
      take: limitNum,
      skip: offsetNum * limitNum,
      orderBy: {
        name: "asc",
      },
    });
    const serializeRooms = rooms.map((r) => {
      return {
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    });
    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    return {
      data: {
        items: serializeRooms,
        meta: {
          nextPage,
          pageCount,
          previousPage,
          total: rowsCount,
        },
      },
      message: "Fetched Successfully!",
      error: null,
    };
  } catch {
    return { error: "Failed to fetch rooms!", data: null, message: null };
  }
};

export const getRoom = async ({
  id,
}: {
  id: string;
}): Promise<GetRoomResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const room = await prisma.room.findFirst({
      where: {
        id,
      },
    });
    if (!room)
      return { error: "Room is not found!", data: null, message: null };
    return { data: room, message: "Fetched Successfully!", error: null };
  } catch {
    return { error: "Failed to fetch rooms!", data: null, message: null };
  }
};

export const updateRoom = async (
  r: editRoomType,
  id: string,
): Promise<UpdateRoomResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const room = await prisma.room.findFirst({
      where: {
        id,
      },
    });
    if (!room)
      return { error: "Room is not found!", data: null, message: null };
    const isEditAble =
      room.floor === r.floor &&
      room.name === r.name &&
      room.roomQR === r.roomQR &&
      room.type === r.type;
    if (isEditAble)
      return {
        error: "Sames values are not allowed",
        data: null,
        message: null,
      };
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
    return {
      data: updatedRoom,
      message: "Your changes is successful!",
      error: null,
    };
  } catch {
    return { error: "Failed to fetch rooms!", data: null, message: null };
  }
};

export const deleteRoom = async (id: string): Promise<DeleteRoomResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const room = await prisma.room.findFirst({
      where: {
        id,
      },
    });
    if (!room)
      return { error: "Room is not found!", data: null, message: null };
    await prisma.room.delete({
      where: {
        roomQR: room.roomQR,
        id: room.id,
      },
    });
    revalidatePath("/admin/rooms", "page");
    return { data: null, message: "Deleting is successful!", error: null };
  } catch {
    return { error: "Failed to fetch rooms!", data: null, message: null };
  }
};
