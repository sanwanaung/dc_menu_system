import { create } from "zustand";

type ChangeUserRoleType = {
  id?: string;
  isOpen: boolean;
  onOpenChangeUserRole: (id?: string) => void;
  onClose: () => void;
};

export const useChangeUserRole = create<ChangeUserRoleType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenChangeUserRole: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
