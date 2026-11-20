import * as z from "zod";

export const addonFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(60, "Name is too long."),
  price: z.coerce.number().min(0, "Price must be 0 or greater.").default(0),
  addonCategoryId: z.string().nullable().optional(),
});

export type FormInput = z.input<typeof addonFormSchema>;
