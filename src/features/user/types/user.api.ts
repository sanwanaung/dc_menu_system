import { ApiResponse, PaginatedData } from "@/features/shared/types";
import { User } from "./user.type";

export type UserListResponse = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type GetUsersResponse = ApiResponse<PaginatedData<UserListResponse>>;

export type GetUserResponse = ApiResponse<User>;

export type UpdateUserRoleResponse = ApiResponse<null>;
