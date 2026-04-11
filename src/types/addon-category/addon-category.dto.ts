import { Addon } from "../addon";

export interface AddonCategoryDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  displayOrder: number;
  isAvailable: boolean;
}

export interface AddonCategoryWithAddonsDTO extends AddonCategoryDTO {
  addon: Addon[];
}

export interface AddonCategoryListDTO {
  addonCategories: AddonCategoryDTO[];
  available: number;
  unavailable: number;
}
