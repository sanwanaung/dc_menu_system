export type RoomServiceDTOStatus =
  | "PENDING"
  | "ACCEPTED"
  | "FINISHED"
  | "CANCELED";

export type RoomServiceDTO = {
  id: string;
  roomId: string;
  date: Date;
  startTime: string;
  endTime: string;
  notes: string | null;
  status: RoomServiceDTOStatus;
  createdAt: string;
  updatedAt: string;
};

export type RoomServiceWithRoomDTO = RoomServiceDTO & {
  room: {
    name: string;
  };
};
