import { create } from "zustand";

type DeleteRoomType = {
  id?: string;
  isOpen: boolean;
  onOpenDelete: (id?: string) => void;
  onClose: () => void;
};

export const useDeleteRoom = create<DeleteRoomType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenDelete: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
