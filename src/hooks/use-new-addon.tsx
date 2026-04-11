import { create } from "zustand";

type ActionTypes = "create" | "edit";

type NewAddonType = {
  isOpen: boolean;
  id?: string | undefined;
  mode: "create" | "edit";
  onOpenNewAddon: () => void;
  onOpenEditAddon: (id?: string, mode?: ActionTypes) => void;
  onClose: () => void;
};

export const useNewAddon = create<NewAddonType>((set) => ({
  isOpen: false,
  id: undefined,
  mode: "create",
  onOpenNewAddon: () => set({ isOpen: true, mode: "create" }),
  onOpenEditAddon: (id?: string) => set({ isOpen: true, mode: "edit", id }),
  onClose: () => set({ isOpen: false }),
}));
