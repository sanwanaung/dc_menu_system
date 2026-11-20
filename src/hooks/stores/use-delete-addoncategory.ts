import { create } from "zustand";

type DeleteAddonCategory = {
  id?: string;
  isOpen: boolean;
  onOpenDeleteAddonCategory: (id?: string) => void;
  onClose: () => void;
};

export const useDeleteAddonCategory = create<DeleteAddonCategory>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenDeleteAddonCategory: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
