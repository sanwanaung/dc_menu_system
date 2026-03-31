"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RoomServiceStatus } from "generated/prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createRoomService = async (
  name: string,
  date: Date,
  stime: string,
  etime: string,
  ot: string,
) => {
  const room = await prisma.room.findFirst({
    where: {
      name,
    },
  });
  if (!room) return;
  const rs = await prisma.roomServiceOrder.create({
    data: {
      date,
      startTime: stime,
      endTime: etime,
      notes: ot,
      roomId: room?.id,
    },
  });
  return rs;
};

export const getRoomServices = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const roomservices = await prisma.roomServiceOrder.findMany({
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
    });
    return { data: roomservices, message: "" };
  } catch {
    return { error: "Failed to fetch roomservices!" };
  }
};

export const updateRoomServiceStatus = async (
  id: string,
  status: RoomServiceStatus,
) => {
  try {
    if (!id || !status) return { error: "Bad Request!" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const isFound = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!isFound) return { error: "Not Found!" };
    await prisma.roomServiceOrder.update({
      data: {
        status,
      },
      where: {
        id: isFound.id,
      },
    });
    revalidatePath("/admin/room-services", "page");
    return { data: null, message: "" };
  } catch {
    return { error: "Failed to update roomservice status!" };
  }
};

export const deleteRoomService = async (id: string) => {
  try {
    if (!id) return { error: "Bad Request!" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const isFound = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!isFound) return { error: "Not Found!" };
    await prisma.roomServiceOrder.delete({
      where: {
        id: isFound.id,
      },
    });
    revalidatePath("/admin/room-services", "page");
    return { data: null, message: "" };
  } catch {
    return { error: "Failed to delete roomservice order!" };
  }
};

export const cancelRoomService = async (
  id: string,
  status: RoomServiceStatus,
  option: string,
) => {
  try {
    if (!id || !status) return { error: "Bad Request!" };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { error: "No Authorization!" };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed) return { error: "You don't have permission!" };
    const isFound = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!isFound) return { error: "Not Found!" };
    await prisma.roomServiceOrder.update({
      data: {
        status,
        notes: option,
      },
      where: {
        id: isFound.id,
      },
    });
    revalidatePath("/admin/room-services", "page");
    return { data: null, message: "" };
  } catch {
    return { error: "Failed to update roomservice status!" };
  }
};

export const getRoomService = async (id: string) => {
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
    const roomservice = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!roomservice) return { error: "Not Found!" };
    return { data: roomservice, message: "" };
  } catch {
    return { error: "Failed to fetch roomservice!" };
  }
};
