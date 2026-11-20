import * as z from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Room name is required.")
    .max(100, "Room name is too long."),
  floor: z
    .string()
    .trim()
    .min(1, "Please select your floor.")
    .refine((val) => val !== "auto", {
      message: "Auto-detection is not allowed. Please select a specific floor.",
    }),
  type: z
    .string()
    .trim()
    .min(1, "Please select your floor.")
    .refine((val) => val !== "auto", {
      message: "Auto-detection is not allowed. Please select a specific floor.",
    }),
  roomQR: z
    .string()
    .trim()
    .min(1, "Room QR is required.")
    .max(120, "Room QR is too long.")
    .regex(/^\S+$/, "Room QR must not contain spaces."),
});

export const editRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Room name is required.")
    .max(100, "Room name is too long."),
  floor: z
    .string()
    .trim()
    .min(1, "Please select your floor.")
    .refine((val) => val !== "auto", {
      message: "Auto-detection is not allowed. Please select a specific floor.",
    }),
  type: z
    .string()
    .trim()
    .min(1, "Please select your floor.")
    .refine((val) => val !== "auto", {
      message: "Auto-detection is not allowed. Please select a specific floor.",
    }),
  roomQR: z
    .string()
    .trim()
    .min(1, "Room QR is required.")
    .max(120, "Room QR is too long.")
    .regex(/^\S+$/, "Room QR must not contain spaces."),
});
