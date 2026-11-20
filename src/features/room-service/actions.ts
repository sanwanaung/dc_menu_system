"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  CancelRoomServiceResponse,
  CreateRoomServiceResponse,
  GetRoomServiceResponse,
  GetRoomServicesResponse,
  UpdateRoomServiceStatusResponse,
} from "@/features/room-service/types";
import { RoomServiceStatus } from "generated/prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getRoomServices = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetRoomServicesResponse> => {
  try {
    const offsetNum = Number(offset);
    const limitNum = Number(limit);
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
    const rowsCount = await prisma.roomServiceOrder.count();
    const roomservices = await prisma.roomServiceOrder.findMany({
      take: limitNum,
      skip: offsetNum * limitNum,
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const serializeRoomServices = roomservices.map((rs) => {
      return {
        ...rs,
        createdAt: rs.createdAt.toISOString(),
        updatedAt: rs.updatedAt.toISOString(),
      };
    });
    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    return {
      data: {
        items: serializeRoomServices,
        meta: {
          nextPage,
          pageCount,
          previousPage,
          total: rowsCount,
        },
      },
      error: null,
      message: "",
    };
  } catch {
    return {
      error: "Failed to fetch roomservices!",
      data: null,
      message: null,
    };
  }
};

export const updateRoomServiceStatus = async (
  id: string,
  status: RoomServiceStatus,
): Promise<UpdateRoomServiceStatusResponse> => {
  try {
    if (!id || !status)
      return { error: "Bad Request!", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const isFound = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!isFound) return { error: "Not Found!", data: null, message: null };
    const result = await prisma.roomServiceOrder.update({
      data: {
        status,
      },
      where: {
        id: isFound.id,
      },
    });
    revalidatePath("/admin/room-services", "page");
    return { data: result, error: null, message: "Fetched Successfully!" };
  } catch {
    return {
      error: "Failed to update roomservice status!",
      data: null,
      message: null,
    };
  }
};

export const deleteRoomService = async (
  id: string,
): Promise<{ error: string | null; data: null; message: string | null }> => {
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
    const isFound = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!isFound) return { error: "Not Found!", data: null, message: null };
    await prisma.roomServiceOrder.delete({
      where: {
        id: isFound.id,
      },
    });
    revalidatePath("/admin/room-services", "page");
    return {
      data: null,
      error: null,
      message: "Room service order deleted successfully!",
    };
  } catch {
    return {
      error: "Failed to delete roomservice order!",
      data: null,
      message: null,
    };
  }
};

export const cancelRoomService = async (
  id: string,
  status: RoomServiceStatus,
  option: string,
): Promise<CancelRoomServiceResponse> => {
  try {
    if (!id || !status)
      return { error: "Bad Request!", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    const isAllowed = session.user.role === allowedUserRole.ADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };
    const isFound = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!isFound) return { error: "Not Found!", data: null, message: null };
    await prisma.roomServiceOrder.update({
      data: {
        status,
        cancellationReason: option,
      },
      where: {
        id: isFound.id,
      },
    });
    revalidatePath("/admin/room-services", "page");
    return {
      data: null,
      error: null,
      message: "Room service order cancelled successfully!",
    };
  } catch {
    return {
      error: "Failed to cancel roomservice order!",
      data: null,
      message: null,
    };
  }
};

export const getRoomService = async (
  id: string,
): Promise<GetRoomServiceResponse> => {
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
    const roomservice = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
      },
    });
    if (!roomservice) return { error: "Not Found!", data: null, message: null };
    return { data: roomservice, message: "Fetched Successfully!", error: null };
  } catch {
    return { error: "Failed to fetch roomservice!", data: null, message: null };
  }
};
