import { ApiResponse, PaginatedData } from "@/features/shared/types";
import { Room } from "./room.type";

export type Rooms = Omit<Room, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type GetRoomsResponse = ApiResponse<PaginatedData<Rooms>>;

export type CreateRoomResponse = ApiResponse<Room>;

export type GetRoomResponse = ApiResponse<Room>;

export type UpdateRoomResponse = ApiResponse<Room>;

export type DeleteRoomResponse = ApiResponse<null>;
