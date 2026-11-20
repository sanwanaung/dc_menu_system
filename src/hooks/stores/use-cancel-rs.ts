import { RoomServiceDTOStatus } from "@/features/room-service/types";
import { create } from "zustand";

type CancelRsType = {
  id?: string;
  isOpen: boolean;
  status?: RoomServiceDTOStatus;
  onOpenCancel: (id?: string, status?: RoomServiceDTOStatus) => void;
  onClose: () => void;
};

export const useCancelRs = create<CancelRsType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenCancel: (id?: string, status?: RoomServiceDTOStatus) =>
    set({ isOpen: true, id, status }),
  onClose: () => set({ isOpen: false }),
}));
