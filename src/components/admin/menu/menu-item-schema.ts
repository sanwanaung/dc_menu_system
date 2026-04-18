import * as z from "zod";

export const menuItemUpsertSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z
    .string()
    .trim()
    .max(400, "Keep the description under 400 characters")
    .optional()
    .nullable(),
  price: z.number().min(0, "Price must be 0 or more"),
  displayOrder: z.number().int().min(0),
  categoryId: z.string().min(1, "Category is required"),
  isAvailable: z.boolean(),
  imageUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export type MenuItemUpsertFormInput = z.input<typeof menuItemUpsertSchema>;

