"use server";

import prisma from "@/lib/prisma";

export const createRoomServiceOrder = async ({
  date,
  startTime,
  endTime,
  notes,
  room,
  roomQR,
}: {
  date: Date;
  startTime: string;
  endTime: string;
  notes: string | null;
  room: string;
  roomQR: string;
}) => {
  try {
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

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const isExistingOrder = await prisma.roomServiceOrder.findFirst({
      where: {
        roomId: isExistingRoom.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
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

    const roomServiceOrder = await prisma.roomServiceOrder.create({
      data: {
        roomId: isExistingRoom.id,
        date,
        startTime: startTime,
        endTime: endTime,
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
    if (!roomQR) {
      return {
        message: null,
        data: null,
        error:
          "Please provide a valid room QR code to fetch room service order.",
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

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const roomServiceOrder = await prisma.roomServiceOrder.findFirst({
      where: {
        roomId: isExistingRoom.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
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
}: {
  id: string;
  roomId: string;
}) => {
  try {
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
  } catch (error) {
    return {
      message: null,
      data: null,
      error: "Failed to delete room-service order. Please try again later.",
    };
  }
};
