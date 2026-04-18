"use client";

import { create } from "zustand";
import type { MenuCategory, MenuItem, MenuItemUpsertInput } from "./types";
import { demoMenuCategories, demoMenuItems } from "./demo";

type MenuState = {
  categories: MenuCategory[];
  items: MenuItem[];

  createItem: (input: MenuItemUpsertInput) => MenuItem;
  updateItem: (id: string, input: MenuItemUpsertInput) => MenuItem | null;
  deleteItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
};

function createId(prefix = "item") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${prefix}-${(crypto as any).randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(
    16,
  )}`;
}

function toImageUrls(imageUrl?: string | null) {
  const url = (imageUrl ?? "").trim();
  return url ? [url] : [];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: demoMenuCategories,
  items: demoMenuItems,

  createItem: (input) => {
    const now = new Date().toISOString();
    const item: MenuItem = {
      id: createId("item"),
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      displayOrder: input.displayOrder,
      categoryId: input.categoryId,
      isAvailable: input.isAvailable,
      imageUrls: toImageUrls(input.imageUrl),
      createdAt: now,
      updatedAt: now,
    };
    set({ items: [item, ...get().items] });
    return item;
  },

  updateItem: (id, input) => {
    const items = get().items;
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const next: MenuItem = {
      ...items[idx],
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      displayOrder: input.displayOrder,
      categoryId: input.categoryId,
      isAvailable: input.isAvailable,
      imageUrls: toImageUrls(input.imageUrl),
      updatedAt: now,
    };
    const copy = [...items];
    copy[idx] = next;
    set({ items: copy });
    return next;
  },

  deleteItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

  toggleAvailability: (id) =>
    set({
      items: get().items.map((i) =>
        i.id === id
          ? { ...i, isAvailable: !i.isAvailable, updatedAt: new Date().toISOString() }
          : i,
      ),
    }),
}));
