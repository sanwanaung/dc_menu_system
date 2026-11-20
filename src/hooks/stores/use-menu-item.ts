import { create } from "zustand";

type MenuItemType = {
  isOpen: boolean;
  onOpenNewMenuItem: () => void;
  onClose: () => void;
};

export const useMenuItem = create<MenuItemType>((set) => ({
  isOpen: false,
  onOpenNewMenuItem: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
