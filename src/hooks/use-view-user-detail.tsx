import { create } from "zustand";

type ViewUserDetailType = {
  id?: string;
  isOpen: boolean;
  onOpenViewUserDetail: (id?: string) => void;
  onClose: () => void;
};

export const useViewUserDetail = create<ViewUserDetailType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenViewUserDetail: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
