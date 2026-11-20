import { ApiResponse, PaginatedData } from "@/features/shared/types";
import { VariantOption } from "./variant-option.type";

export type VariantOptionSerializable = Omit<
  VariantOption,
  "createdAt" | "updatedAt" | "price"
> & {
  createdAt: string;
  updatedAt: string;
  price: number;
};

export type VariantOptionsForMenu = Pick<VariantOption, "id" | "name">;

export type GetVariantOptionsResponse = ApiResponse<
  PaginatedData<VariantOptionSerializable>
>;

export type GetVariantOptionResponse = ApiResponse<VariantOptionSerializable>;

export type CreateVariantOptionResponse =
  ApiResponse<VariantOptionSerializable>;

export type UpdateVariantOptionResponse =
  ApiResponse<VariantOptionSerializable>;

export type DeleteVariantOptionResponse = ApiResponse<null>;

export type ToggleAvailabiltyResponse = ApiResponse<VariantOptionSerializable>;

export type GetVariantOptionsForMenuResponse = ApiResponse<
  VariantOptionsForMenu[]
>;
