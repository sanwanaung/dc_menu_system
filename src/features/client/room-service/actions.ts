"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyScanSessionToken } from "@/features/client/actions";
import { SCAN_SESSION_TOKEN } from "@/lib";
import { logger } from "@/utils/logger";
import {
  getRoomServiceWindow,
  getTodayRoomServiceWindow,
} from "@/lib/room-service-date";

export const createRoomServiceOrder = async ({
  date,
  startTime,
  endTime,
  notes,
  room,
  roomQR,
}: {
  date: string | undefined;
  startTime: string;
  endTime: string;
  notes: string | null;
  room: string;
  roomQR: string;
}) => {
  try {
    const token = (await cookies()).get(SCAN_SESSION_TOKEN);
    if (!token) {
      return {
        message: null,
        data: null,
        error:
          "Your ordering session could not be found. Please scan the QR code again.",
      };
    }
    const isValidToken = await verifyScanSessionToken({
      token: token.value,
      roomQR,
    });
    if (isValidToken.error) {
      return {
        data: null,
        message: null,
        error: isValidToken.error || "Something went wrong!",
      };
    }
    if (!date || !startTime || !endTime || !room || !roomQR) {
      return {
        message: null,
        data: null,
        error:
          "Please fill in all required fields for your room service request or ensure you are in a valid room with a QR code.",
      };
    }

    const isExistingRoom = await prisma.room.findUnique({
      where: {
        roomQR: roomQR,
      },
    });

    if (!isExistingRoom) {
      return {
        message: null,
        data: null,
        error:
          "Invalid room / QR code combination. Please ensure you are in a valid room and try again.",
      };
    }

    const { start, end } = getRoomServiceWindow(date);

    const isExistingOrder = await prisma.roomServiceOrder.findFirst({
      where: {
        roomId: isExistingRoom.id,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (isExistingOrder) {
      return {
        message: null,
        data: null,
        error: `You already have an active room service request for today.
           Please wait for it to be completed before making a new request or canceling the existing one.`,
      };
    }

    const stTime = startTime.split(" ")[0];
    const edTime = endTime.split(" ")[0];

    const roomServiceOrder = await prisma.roomServiceOrder.create({
      data: {
        roomId: isExistingRoom.id,
        date: start,
        startTime: stTime,
        endTime: edTime,
        notes: notes,
        status: "PENDING",
      },
    });

    return {
      message: "Room service request submitted successfully!",
      data: roomServiceOrder,
      error: null,
    };
  } catch (error) {
    console.error("Failed to create room-service", error);

    return {
      message: null,
      data: null,
      error: "Failed to request room-service. Please try again later.",
    };
  }
};

export const getRoomServiceOrder = async (roomQR: string) => {
  try {
    logger.info("roomQR: " + roomQR);
    const token = (await cookies()).get(SCAN_SESSION_TOKEN);
    logger.info("token: " + token);
    if (!roomQR) {
      return {
        message: null,
        data: null,
        error:
          "Please provide a valid room QR code to fetch room service order.",
      };
    }
    if (!token) {
      return {
        message: null,
        data: null,
        error:
          "Your ordering session could not be found. Please scan the QR code again.",
      };
    }
    const roomSessionToken = await prisma.roomSessionToken.findUnique({
      where: { sessionToken: token.value },
    });
    const isValidToken = await verifyScanSessionToken({
      token: token.value,
      roomId: roomSessionToken?.roomId,
    });
    if (isValidToken.error) {
      return {
        data: null,
        message: null,
        error: isValidToken.error || "Something went wrong!",
      };
    }

    const isExistingRoom = await prisma.room.findUnique({
      where: {
        roomQR: roomQR,
      },
    });

    if (!isExistingRoom) {
      return {
        message: null,
        data: null,
        error:
          "Invalid QR code. Please ensure you are in a valid room and try again.",
      };
    }

    const { start, end } = getTodayRoomServiceWindow();

    const roomServiceOrder = await prisma.roomServiceOrder.findFirst({
      where: {
        roomId: isExistingRoom.id,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    return {
      message: null,
      data: roomServiceOrder,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch room-service order", error);

    return {
      message: null,
      data: null,
      error: "Failed to fetch room-service order. Please try again later.",
    };
  }
};

export const deleteRoomServiceOrder = async ({
  id,
  roomId,
  roomQR,
}: {
  id: string;
  roomId: string;
  roomQR: string;
}) => {
  try {
    const token = (await cookies()).get(SCAN_SESSION_TOKEN);
    if (!token) {
      return {
        message: null,
        data: null,
        error:
          "Your ordering session could not be found. Please scan the QR code again.",
      };
    }
    const isValidToken = await verifyScanSessionToken({
      token: token.value,
      roomQR,
    });
    if (isValidToken.error) {
      return {
        data: null,
        message: null,
        error: isValidToken.error || "Something went wrong!",
      };
    }
    if (!id || !roomId) {
      return {
        message: null,
        data: null,
        error: "Invalid request params",
      };
    }

    const isExistingRoom = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!isExistingRoom) {
      return {
        message: null,
        data: null,
        error:
          "Invalid QR code. Please ensure you are in a valid room and try again.",
      };
    }
    const isExistingRoomService = await prisma.roomServiceOrder.findFirst({
      where: {
        id,
        roomId: isExistingRoom.id,
      },
    });

    if (!isExistingRoomService) {
      return {
        data: null,
        message: null,
        error: "Not Found!",
      };
    }

    const deletedRoomService = await prisma.roomServiceOrder.delete({
      where: {
        id,
      },
    });

    return {
      message: null,
      data: deletedRoomService,
      error: null,
    };
  } catch {
    return {
      message: null,
      data: null,
      error: "Failed to delete room-service order. Please try again later.",
    };
  }
};
