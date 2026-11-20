export interface MenuCategoryDTO {
  name: string;
  id: string;
  displayOrder: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategoryListDTO {
  menuCategories: MenuCategoryDTO[];
  available: number;
  unavailable: number;
}
