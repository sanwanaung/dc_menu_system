import { MenuCategory } from "../menu-category";
import { SerializeVariantOption } from "./menu-item.api";

type MenuCategoryDetail = Pick<MenuCategory, "id" | "name">;

type IMAGE_TYPE = "BASE_IMAGE" | "VARIANT_IMAGE";

export interface BaseMenuItemDTO {
  name: string;
  id: string;
  description: string | null;
  price: number;
  displayOrder: number;
  categoryId: string;
  isAvailable: boolean;
  baseImage: string | null;
  createdAt: string;
  updatedAt: string;
  ratingAverage: number;
  ratingCount: number;
  imageType: IMAGE_TYPE;
  menuCategoryMenuItems: {
    menuCategory: MenuCategoryDetail;
  }[];
  menuItemVariantOptions: {
    variantOption: SerializeVariantOption;
  }[];
}

export type MenuItemDTO = Pick<
  BaseMenuItemDTO,
  | "id"
  | "imageType"
  | "baseImage"
  | "name"
  | "price"
  | "isAvailable"
  | "updatedAt"
  | "displayOrder"
  | "menuCategoryMenuItems"
  | "menuItemVariantOptions"
>;
