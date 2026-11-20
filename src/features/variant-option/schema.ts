import * as z from "zod";

export const variantOptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required!" })
    .max(30, { message: "Name is too long!" }),
  price: z
    .number()
    .int("Price must be whole number")
    .min(0, "Price must be 0 or greater.")
    .default(0),
  isAvailable: z.boolean().default(true),
  displayOrder: z
    .number()
    .int("Display order must be a whole number.")
    .min(0, "Display order must be 0 or greater.")
    .default(0),
});

export type VariantOptionFormSchema = z.input<typeof variantOptionSchema>;
