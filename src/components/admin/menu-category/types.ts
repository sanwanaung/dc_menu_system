export type MenuCategory = {
  id: string;
  name: string;
  displayOrder: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuCategoryDraft = Pick<
  MenuCategory,
  "name" | "displayOrder" | "isAvailable"
>;

