import { Addon } from "@/types/addon";
import crypto from "crypto";
import QRCode from "qrcode";

export const allowedUserRole = {
  ADMIN: "admin",
  SUBADMIN: "subadmin",
  USER: "user",
};

export const generateQrFile = async (roomName: string, roomQR: string) => {
  try {
    const qrCodeData = `${process.env.APP_URL}?room=${encodeURIComponent(
      roomName,
    )}&roomQR=${encodeURIComponent(roomQR)}`;

    const buffer = await QRCode.toBuffer(qrCodeData, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });

    const uint8Array = new Uint8Array(buffer);

    return new File([uint8Array], `room-${roomQR}.png`, {
      type: "image/png",
    });
  } catch (error) {
    console.error("QR generation failed:", error);
    throw new Error("Failed to generate QR file");
  }
};

export const generateRandomString = (length: number) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

export function toDTO(data: Addon) {
  return {
    ...data,
    price: Number(data.price),
  };
}
