export type MenuCategory = {
  id: string;
  name: string;
  displayOrder: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  categoryId: string;
  isAvailable: boolean;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export type MenuItemUpsertInput = {
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  categoryId: string;
  isAvailable: boolean;
  imageUrl?: string | null;
};

