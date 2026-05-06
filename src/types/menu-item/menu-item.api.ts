import { MenuCategory } from "../menu-category";
import { ApiResponse, PaginatedData } from "../shared/api-response";
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
