import { ApiResponse, PaginatedData } from "../shared/api-response";
import { AddonCategory } from "./addon-category.type";

export type AddonCategoryListResponseSerializable = Omit<
  AddonCategory,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type AddonCategoriesForMenu = Pick<AddonCategory, "id" | "name">;

export type GetAddonCategoriesResponse = ApiResponse<
  PaginatedData<AddonCategoryListResponseSerializable>
>;

export type GetAddonCategoryResponse = ApiResponse<AddonCategory>;

export type CreateNewAddonCategoryResponse = ApiResponse<AddonCategory>;

export type UpdateAddonCategoryResponse = ApiResponse<AddonCategory>;

export type UpdateAddonCategoryAvailabilityResponse =
  ApiResponse<AddonCategory>;

export type DeleteAddonCategoryResponse = ApiResponse<null>;

export type GetAvailableAddonCategoriesResponse = ApiResponse<
  AddonCategoryListResponseSerializable[]
>;

export type GetAvailableAddonCategoriesByIdResponse = ApiResponse<
  AddonCategoryListResponseSerializable[]
>;

export type GetAddonCategoriesForMenuResponse = ApiResponse<
  AddonCategoriesForMenu[]
>;
