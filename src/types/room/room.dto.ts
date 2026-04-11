export interface RoomDTO {
  id: string;
  name: string;
  imgUrl?: string | null;
  roomQR: string;
  type: string;
  floor: string;
  createdAt: Date;
  updatedAt: Date;
}
