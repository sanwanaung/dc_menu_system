import { Prisma } from "../../../generated/prisma/client";

export type AddonCategory = Prisma.AddonCategoryGetPayload<
  Record<string, never>
>;

export type AddonCategoryWithAddons = Prisma.AddonCategoryGetPayload<{
  include: {
    addons: true;
  };
}>;
