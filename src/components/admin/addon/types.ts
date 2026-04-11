export type AddonCategory = {
  id: string;
  name: string;
  displayOrder: number;
  isAvailable: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type Addon = {
  id: string;
  name: string;
  price: number;
  addonCategoryId?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type CategoryFilter = "all" | string;
export type PriceFilter = "all" | "free" | "paid";
export type SortKey = "updatedDesc" | "nameAsc" | "priceAsc" | "priceDesc";

