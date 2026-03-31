import { RoomServiceStatus } from "@/utils";
import { create } from "zustand";

type CancelRsType = {
  id?: string;
  isOpen: boolean;
  status?: RoomServiceStatus;
  onOpenCancel: (id?: string, status?: RoomServiceStatus) => void;
  onClose: () => void;
};

export const useCancelRs = create<CancelRsType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenCancel: (id?: string, status?: RoomServiceStatus) =>
    set({ isOpen: true, id, status }),
  onClose: () => set({ isOpen: false }),
}));
