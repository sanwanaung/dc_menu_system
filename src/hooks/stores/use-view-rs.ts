import { create } from "zustand";

type ViewRsNoteType = {
  id?: string;
  isOpen: boolean;
  onOpenViewNote: (id?: string) => void;
  onClose: () => void;
};

export const useViewRsNotes = create<ViewRsNoteType>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenViewNote: (id?: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
