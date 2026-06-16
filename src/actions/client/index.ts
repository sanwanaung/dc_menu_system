"use server";

import jwt from "jsonwebtoken";

export const verifyScanSessionToken = async ({ token }: { token: string }) => {
  try {
    if (!token) {
      return { error: "Missing token!", data: null, message: null };
    }
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!);
    return { error: null, data: verifiedToken, message: "Success!" };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        error:
          "Your ordering session has expired. Please scan the QR code again.",
        data: null,
        message: null,
      };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        error: "Invalid ordering session. Please scan the QR code again.",
        data: null,
        message: null,
      };
    }
    return {
      error: "Unable to verify your ordering session. Please try again later.",
      data: null,
      message: null,
    };
  }
};
