import { create } from "zustand";

type DeleteMenuCategoryType = {
  id?: string;
  isOpen: boolean;
  onOpenDelete: (id?: string) => void;
  onClose: () => void;
};

export const useDeleteMenuCategory = create<DeleteMenuCategoryType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenDelete: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
