import { create } from "zustand";

type ActionTypes = "create" | "edit";

type NewAddonCategoryType = {
  isOpen: boolean;
  id?: string | undefined;
  mode: "create" | "edit";
  onOpenNewAddonCategory: () => void;
  onOpenEditAddonCategory: (id?: string, mode?: ActionTypes) => void;
  onClose: () => void;
};

export const useNewAddonCategory = create<NewAddonCategoryType>((set) => ({
  isOpen: false,
  id: undefined,
  mode: "create",
  onOpenNewAddonCategory: () => set({ isOpen: true, mode: "create" }),
  onOpenEditAddonCategory: (id?: string) =>
    set({ isOpen: true, mode: "edit", id }),
  onClose: () => set({ isOpen: false }),
}));
