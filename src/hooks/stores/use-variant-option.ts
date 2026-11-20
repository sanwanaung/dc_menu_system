import { create } from "zustand";

type ActionTypes = "create" | "edit" | "delete";

type VariantOptionType = {
  isOpen: boolean;
  isDelete: boolean;
  id?: string | undefined;
  mode: ActionTypes;
  onOpenNewVariantOption: (mod?: ActionTypes) => void;
  onOpenEditVariantOptin: (id?: string, mode?: ActionTypes) => void;
  onOpenDeleteVariantOption: (id?: string, mode?: ActionTypes) => void;
  onClose: () => void;
};

export const useVariantOption = create<VariantOptionType>((set) => ({
  isOpen: false,
  id: undefined,
  mode: "create",
  isDelete: false,
  onOpenNewVariantOption: (mode?: ActionTypes) => set({ isOpen: true, mode }),
  onOpenEditVariantOptin: (id?: string, mode?: ActionTypes) =>
    set({ isOpen: true, mode, id }),
  onOpenDeleteVariantOption: (id?: string, mode?: ActionTypes) =>
    set({ id, isDelete: true, mode }),
  onClose: () => set({ isOpen: false, isDelete: false }),
}));
