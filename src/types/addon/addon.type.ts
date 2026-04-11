import { Prisma } from "./../../../generated/prisma/client";

export type Addon = Prisma.AddonGetPayload<Record<string, never>>;

export type AddonWithAddonCategories = Prisma.AddonGetPayload<{
  include: {
    addonCategory: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;
