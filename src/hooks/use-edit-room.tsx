import { create } from "zustand";

type EditRoomType = {
  id?: string;
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;
};

export const useEditRoom = create<EditRoomType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
