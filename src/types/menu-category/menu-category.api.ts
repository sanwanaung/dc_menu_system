import { ApiResponse, PaginatedData } from "../shared/api-response";
import { MenuCategory } from "./menu-category.type";

export type MenuCategoryListResponse = Omit<
  MenuCategory,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type GetMenuCategoriesResponse = ApiResponse<
  PaginatedData<MenuCategoryListResponse>
>;

export type GetMenuCategoryResponse = ApiResponse<MenuCategory>;

export type CreateMenuCategoryResponse = ApiResponse<MenuCategory>;

export type UpdateMenuCategoryResponse = ApiResponse<MenuCategory>;

export type UpdateAvailabilityResponse = ApiResponse<MenuCategory>;

export type DeleteMenuCategoryResponse = ApiResponse<null>;
