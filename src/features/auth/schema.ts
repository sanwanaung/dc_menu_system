import * as z from "zod";

export const signinSchema = z.object({
  email: z.string().email().min(1, "email is required"),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have less than 16 characters"),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name is required")
    .max(20, "Name must have less than 20 characters"),
  email: z.string().email().min(1, "email is required"),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have less than 16 characters"),
});
