import { ApiResponse, PaginatedData } from "../shared/api-response";
import { MenuItem } from "./menu-item.type";

export type SerializeMenuItem = Omit<
  MenuItem,
  "createdAt" | "updatedAt" | "price"
> & {
  createdAt: string;
  updatedAt: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
};

export type GetMenuItemsResponse = ApiResponse<
  PaginatedData<SerializeMenuItem>
>;

export type GetMenuItemResponse = ApiResponse<SerializeMenuItem>;

export type CreateNewMenuItemResponse = ApiResponse<SerializeMenuItem>;

export type UpdateMenuItemResponse = ApiResponse<SerializeMenuItem>;

export type DeleteMenuItemResponse = ApiResponse<SerializeMenuItem>;
