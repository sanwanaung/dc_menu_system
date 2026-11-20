import { create } from "zustand";

type NewRoomType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewRoom = create<NewRoomType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
