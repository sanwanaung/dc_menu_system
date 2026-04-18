import { create } from "zustand";

type DeleteAddonType = {
  isOpen: boolean;
  id?: string | undefined;
  onDeleteAddon: (id?: string) => void;
  onClose: () => void;
};

export const useDeleteAddon = create<DeleteAddonType>((set) => ({
  isOpen: false,
  id: undefined,
  onDeleteAddon: (id?: string) => set({ id, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
