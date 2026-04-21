"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  VariantOptionFormSchema,
  variantOptionSchema,
} from "@/schemas/variant-option";
import {
  CreateVariantOptionResponse,
  DeleteVariantOptionResponse,
  GetVariantOptionResponse,
  GetVariantOptionsForMenuResponse,
  GetVariantOptionsResponse,
  ToggleAvailabiltyResponse,
  UpdateVariantOptionResponse,
} from "@/types/variant-option";
import { headers } from "next/headers";

export const getVariantOptions = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<GetVariantOptionsResponse> => {
  try {
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", message: null, data: null };
    const isAllowed =
      session.user.role === allowedUserRole.ADMIN ||
      session.user.role === allowedUserRole.SUBADMIN;
    if (!isAllowed)
      return { error: "You don't have permission!", data: null, message: null };

    const [rowsCount, variantOptions] = await prisma.$transaction([
      prisma.variantOption.count(),
      prisma.variantOption.findMany({
        take: limitNum,
        skip: offsetNum * limitNum,
        orderBy: {
          displayOrder: "asc",
        },
      }),
    ]);

    const serializeVariantOptions = variantOptions.map((item) => {
      return {
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        price: Number(item.price),
      };
    });

    const [available, unavailable] = await prisma.$transaction([
      prisma.variantOption.count({ where: { isAvailable: true } }),
      prisma.variantOption.count({ where: { isAvailable: false } }),
    ]);

    const pageCount = Math.ceil(rowsCount / limitNum);
    const nextPage = offsetNum < pageCount ? offsetNum + 1 : null;
    const previousPage = offsetNum !== 0 ? offsetNum - 1 : null;

    return {
      data: {
        items: serializeVariantOptions,
        meta: {
          total: rowsCount,
          nextPage,
          previousPage,
          pageCount,
        },
        summary: {
          available,
          unavailable,
        },
      },
      message: "Fetched Successfully!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to fetch VariantOptions!",
      data: null,
      message: null,
    };
  }
};

export const createNewVariantOption = async ({
  form,
}: {
  form: VariantOptionFormSchema;
}): Promise<CreateVariantOptionResponse> => {
  try {
    const isValid = variantOptionSchema.safeParse(form);
    if (isValid.error) {
      return { error: isValid.error.message, data: null, message: null };
    }
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };

    const newVariantOption = await prisma.variantOption.create({
      data: {
        name: form.name,
        displayOrder: form.displayOrder,
        isAvailable: form.isAvailable,
        price: form.price,
      },
    });

    const serializeVariantOption = {
      ...newVariantOption,
      createdAt: newVariantOption.createdAt.toISOString(),
      updatedAt: newVariantOption.updatedAt.toISOString(),
      price: Number(newVariantOption.price),
    };

    return {
      data: serializeVariantOption,
      message: "New Variant Option is added!",
      error: null,
    };
  } catch (error) {
    console.log("error in create variant option: ", error);
    return {
      error: "Failed to create variant option",
      data: null,
      message: null,
    };
  }
};

export const toggleAvailability = async ({
  id,
}: {
  id: string;
}): Promise<ToggleAvailabiltyResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };

    const hasFound = await prisma.variantOption.findFirst({ where: { id } });

    if (!hasFound)
      return { error: "No data is found!", data: null, message: null };

    const updatedVariantOption = await prisma.variantOption.update({
      where: { id },
      data: {
        isAvailable: !hasFound.isAvailable,
      },
    });

    const serializeVariantOption = {
      ...updatedVariantOption,
      createdAt: updatedVariantOption.createdAt.toISOString(),
      updatedAt: updatedVariantOption.updatedAt.toISOString(),
      price: updatedVariantOption.price.toNumber(),
    };

    return {
      data: serializeVariantOption,
      message: "Toggled Successfully!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to toggle availability of variant option",
      data: null,
      message: null,
    };
  }
};

export const getVariantOption = async ({
  id,
}: {
  id: string;
}): Promise<GetVariantOptionResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return {
        error: "You don't have permission!",
        data: null,
        message: null,
      };

    const hasFound = await prisma.variantOption.findFirst({ where: { id } });
    if (!hasFound)
      return { error: "No data is found!", data: null, message: null };

    const serializeVariantOption = {
      ...hasFound,
      createdAt: hasFound.createdAt.toISOString(),
      updatedAt: hasFound.updatedAt.toISOString(),
      price: hasFound.price.toNumber(),
    };

    return {
      data: serializeVariantOption,
      message: "Fetched Successfully!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to fetch variant option",
      data: null,
      message: null,
    };
  }
};

export const updateVariantOption = async ({
  id,
  form,
}: {
  id: string;
  form: VariantOptionFormSchema;
}): Promise<UpdateVariantOptionResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const isValid = variantOptionSchema.safeParse(form);
    if (isValid.error)
      return { error: `${isValid.error.message}`, data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return {
        error: "You don't have permission!",
        data: null,
        message: null,
      };

    const hasFound = await prisma.variantOption.findFirst({ where: { id } });
    if (!hasFound)
      return { error: "No data is found!", data: null, message: null };

    const nameChanged = isValid.data.name.trim() !== hasFound.name;
    const priceChanged = isValid.data.price !== Number(hasFound.price);
    const displayOrderChanged =
      isValid.data.displayOrder !== hasFound.displayOrder;
    const availabilityChanged =
      isValid.data.isAvailable !== hasFound.isAvailable;

    if (
      !nameChanged &&
      !priceChanged &&
      !displayOrderChanged &&
      !availabilityChanged
    ) {
      return { error: "No changes detected.", data: null, message: null };
    }

    const updatedVariantOption = await prisma.variantOption.update({
      where: { id },
      data: {
        name: isValid.data.name,
        price: isValid.data.price,
        displayOrder: isValid.data.displayOrder,
        isAvailable: isValid.data.isAvailable,
      },
    });

    const serializeVariantOption = {
      ...updatedVariantOption,
      createdAt: updatedVariantOption.createdAt.toISOString(),
      updatedAt: updatedVariantOption.updatedAt.toISOString(),
      price: updatedVariantOption.price.toNumber(),
    };

    return {
      data: serializeVariantOption,
      message: "Updated Successfully!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to fetch variant option",
      data: null,
      message: null,
    };
  }
};

export const deleteVariantOption = async ({
  id,
}: {
  id: string;
}): Promise<DeleteVariantOptionResponse> => {
  try {
    if (!id) return { error: "Bad Request", data: null, message: null };
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { error: "No Authorization!", data: null, message: null };
    if (session.user.role !== allowedUserRole.ADMIN)
      return { error: "You don't have permission!", data: null, message: null };

    const hasFound = await prisma.variantOption.findFirst({ where: { id } });

    if (!hasFound)
      return { error: "No data is found!", data: null, message: null };

    await prisma.variantOption.delete({
      where: { id },
    });

    return {
      data: null,
      message: "Deleted Successfully!",
      error: null,
    };
  } catch {
    return {
      error: "Failed to delete variant option",
      data: null,
      message: null,
    };
  }
};

export const getVariantOptionsForMenu =
  async (): Promise<GetVariantOptionsForMenuResponse> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session)
        return { error: "No Authorization!", message: null, data: null };
      const isAllowed =
        session.user.role === allowedUserRole.ADMIN ||
        session.user.role === allowedUserRole.SUBADMIN;
      if (!isAllowed)
        return {
          error: "You don't have permission!",
          data: null,
          message: null,
        };

      const variantOptions = await prisma.variantOption.findMany({
        where: { isAvailable: true },
        orderBy: {
          displayOrder: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });

      return {
        data: variantOptions,
        message: "Fetched Successfully!",
        error: null,
      };
    } catch {
      return {
        error: "Failed to fetch VariantOptions!",
        data: null,
        message: null,
      };
    }
  };
