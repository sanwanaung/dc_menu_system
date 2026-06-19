"use server";

import prisma from "@/lib/prisma";

export const verifyScanSessionToken = async ({
  token,
  roomQR,
  roomId,
}: {
  token: string;
  roomQR?: string;
  roomId?: string;
}) => {
  try {
    if (!token) {
      return { error: "Missing token!", data: null, message: null };
    }

    const sessionToken = await prisma.roomSessionToken.findFirst({
      where: {
        sessionToken: token,
        expiresIn: {
          gt: new Date(),
        },
        ...(roomId ? { roomId } : {}),
        ...(roomQR
          ? {
              room: {
                roomQR,
              },
            }
          : {}),
      },
      select: {
        id: true,
        sessionToken: true,
        expiresIn: true,
        roomId: true,
        room: {
          select: {
            id: true,
            name: true,
            roomQR: true,
          },
        },
      },
    });

    if (!sessionToken) {
      return {
        error:
          "Your ordering session could not be found or has expired. Please scan the QR code again.",
        data: null,
        message: null,
      };
    }

    return { error: null, data: sessionToken, message: "Success!" };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to verify your ordering session. Please try again later.",
      data: null,
      message: null,
    };
  }
};
