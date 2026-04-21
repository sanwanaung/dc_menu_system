import { MenuCategory } from "../menu-category";

type MenuCategoryDetail = Pick<MenuCategory, "id" | "name">;

export interface MenuItemDTO {
  name: string;
  id: string;
  description: string | null;
  price: number;
  displayOrder: number;
  categoryId: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  ratingAverage: number;
  ratingCount: number;
  category: MenuCategoryDetail;
}
