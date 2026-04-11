import * as z from "zod";

export const addonCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(50, "Name is too long."),
  displayOrder: z.coerce
    .number()
    .int("Display order must be a whole number.")
    .min(0, "Display order must be 0 or greater.")
    .default(0),
  isAvailable: z.boolean().default(true),
});

export type MenuCategoryFormValues = z.infer<typeof addonCategoryFormSchema>;
