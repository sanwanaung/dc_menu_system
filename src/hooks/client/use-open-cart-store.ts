import { create } from "zustand";

type OpenCartStoreType = {
  isOpen: boolean;
  onOpenCart: () => void;
  onCloseCart: () => void;
};

export const useOpenCartStore = create<OpenCartStoreType>((set) => ({
  isOpen: false,
  onOpenCart: () => set({ isOpen: true }),
  onCloseCart: () => set({ isOpen: false }),
}));
