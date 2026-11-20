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
      },
    });

    if (!sessionToken) {
      return {
        error:
          "Your ordering session could not be found. Please scan the QR code again.",
        data: null,
        message: null,
      };
    }

    if (sessionToken.expiresIn <= new Date()) {
      await prisma.roomSessionToken.delete({
        where: {
          id: sessionToken.id,
        },
      });
      return {
        error:
          "Your ordering session has expired. Please scan the QR code again.",
        data: null,
        message: null,
      };
    }

    return { error: null, data: null, message: "Success!" };
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
