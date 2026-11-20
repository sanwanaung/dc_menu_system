import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const IMAGE_TYPES = ["BASE_IMAGE", "VARIANT_IMAGE"] as const;

export const menuItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(60, "Name is too long."),
  price: z.coerce.number().min(0, "Price must be 0 or greater.").default(0),
  description: z.string().trim().optional(),
  displayOrder: z.coerce
    .number()
    .min(0, "Price must be 0 or greater.")
    .default(0),
  isAvailable: z.boolean().default(true),
  menuCategories: z
    .array(
      z.object({
        label: z.string().trim(),
        value: z.string().trim(),
      }),
    )
    .min(1, "Pick at least one menucategory"),
  addonCategories: z
    .array(
      z.object({
        label: z.string().trim(),
        value: z.string().trim(),
      }),
    )
    .optional(),
  variantOptions: z
    .array(
      z.object({
        label: z.string().trim(),
        value: z.string().trim(),
      }),
    )
    .optional(),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 10MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpeg, .jpg, .png, .webp and .svg formats are supported.",
    )
    .optional(),
  imageType: z.enum(IMAGE_TYPES).default("BASE_IMAGE"),
});

export type FormInput = z.input<typeof menuItemFormSchema>;
