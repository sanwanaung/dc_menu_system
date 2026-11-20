import { create } from "zustand";

type ActionTypes = "create" | "edit";

type NewMenuCategory = {
  isOpen: boolean;
  id?: string | undefined;
  mode: "create" | "edit";
  onOpenNewMenuCategory: () => void;
  onOpenEditMenuCategory: (id?: string, mode?: ActionTypes) => void;
  onClose: () => void;
};

export const useNewMenuCategory = create<NewMenuCategory>((set) => ({
  isOpen: false,
  id: undefined,
  mode: "create",
  onOpenNewMenuCategory: () => set({ isOpen: true, mode: "create" }),
  onOpenEditMenuCategory: (id?: string) =>
    set({ isOpen: true, mode: "edit", id }),
  onClose: () => set({ isOpen: false }),
}));
