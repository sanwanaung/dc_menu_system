import { create } from "zustand";

type DeleteRsType = {
  id?: string;
  isOpen: boolean;
  onOpenDelete: (id?: string) => void;
  onClose: () => void;
};

export const useDeleteRs = create<DeleteRsType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenDelete: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
