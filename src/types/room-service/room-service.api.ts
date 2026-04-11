import { ApiResponse, PaginatedData } from "../shared/api-response";
import { RoomService } from "./room-service.type";

export type RoomServiceWithRoom = Omit<
  RoomService,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  room: {
    name: string;
  };
};

export type GetRoomServicesResponse = ApiResponse<
  PaginatedData<RoomServiceWithRoom>
>;

export type GetRoomServiceResponse = ApiResponse<RoomService>;

export type CreateRoomServiceResponse = ApiResponse<RoomService>;

export type UpdateRoomServiceStatusResponse = ApiResponse<RoomService>;

export type DeleteRoomServiceResponse = ApiResponse<null>;

export type CancelRoomServiceResponse = ApiResponse<null>;
