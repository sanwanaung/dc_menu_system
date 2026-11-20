import { ApiResponse, PaginatedData } from "@/features/shared/types";
import { Addon, AddonWithAddonCategories } from "./addon.type";

export type AddonSummary = {
  free: number;
  paid: number;
};

export type AddonWithAddonCategoriesSerializable = Omit<
  AddonWithAddonCategories,
  "price" | "createdAt" | "updatedAt"
> & {
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type AddonSerializable = Omit<
  Addon,
  "price" | "createdAt" | "updatedAt"
> & {
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type GetAddonsResponse = ApiResponse<
  PaginatedData<AddonWithAddonCategoriesSerializable>
>;

export type GetAddonResponse = ApiResponse<AddonSerializable>;

export type CreateAddonResponse = ApiResponse<AddonSerializable>;

export type UpdateAddonResponse = ApiResponse<AddonSerializable>;

export type DeleteAddonResponse = ApiResponse<null>;
