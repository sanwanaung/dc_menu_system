import { MenuCategory } from "@/features/menu-category/types";
import { ApiResponse, PaginatedData } from "@/features/shared/types";
import { MenuItem, VariantOption } from "./menu-item.type";

export type BaseMenuItem = Pick<
  MenuItem,
  | "id"
  | "imageType"
  | "baseImage"
  | "name"
  | "price"
  | "isAvailable"
  | "updatedAt"
  | "displayOrder"
>;

export type BaseVariantOption = Pick<
  VariantOption,
  "id" | "name" | "displayOrder" | "isAvailable" | "price"
>;

export type MenuCateoryForMenu = Pick<MenuCategory, "id" | "name">;

export type SerializeMenuItem = Omit<
  BaseMenuItem,
  "createdAt" | "updatedAt" | "price"
> & {
  updatedAt: string;
  price: number;
};

export type SerializeVariantOption = Omit<BaseVariantOption, "price"> & {
  price: number;
};

export type SerializeMenuItemList = SerializeMenuItem & {
  menuCategoryMenuItems: {
    menuCategory: MenuCateoryForMenu;
  }[];
  menuItemVariantOptions: {
    variantOption: SerializeVariantOption;
  }[];
};

export type GetMenuItemsResponse = ApiResponse<
  PaginatedData<SerializeMenuItemList>
>;

export type GetMenuItemResponse = ApiResponse<SerializeMenuItem>;

export type CreateNewMenuItemResponse = ApiResponse<SerializeMenuItem | null>;

export type UpdateMenuItemResponse = ApiResponse<SerializeMenuItem>;

export type DeleteMenuItemResponse = ApiResponse<SerializeMenuItem>;

export type SerializeVariantImage = {
  id: string;
  url: string;
};

export type SerializeMenuItemVariantOptionDetails = {
  id: string;
  variantOption: SerializeVariantOption;
  variantImage: SerializeVariantImage[];
};

export type SerializeMenuItemDetails = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  isAvailable: boolean;
  baseImage: string | null;
  imageType: "BASE_IMAGE" | "VARIANT_IMAGE";
  createdAt: string;
  updatedAt: string;
  menuCategoryMenuItems: {
    menuCategory: MenuCateoryForMenu;
  }[];
  menuItemAddonCategories: {
    addonCategory: {
      id: string;
      name: string;
    };
  }[];
  menuItemVariantOptions: SerializeMenuItemVariantOptionDetails[];
  selectedVariant: SerializeMenuItemVariantOptionDetails | null;
};

export type GetMenuItemDetailsResponse = ApiResponse<SerializeMenuItemDetails>;
