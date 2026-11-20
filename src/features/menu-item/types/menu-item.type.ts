import { Prisma } from "../../../../generated/prisma/client";

export type MenuItem = Prisma.MenuItemGetPayload<Record<string, never>>;

export type VariantOption = Prisma.VariantOptionGetPayload<
  Record<string, never>
>;
