import { AddonCategoryDTO } from "@/features/addon-category/types";

export interface AddonDTO {
  id: string;
  name: string;
  status: "FREE" | "PAID";
  price: number;
  addonCategoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddonWithAddonCategoryDTO extends AddonDTO {
  addonCategory: Pick<AddonCategoryDTO, "name" | "id"> | null;
}

export interface PaginationMeta {
  total: number;
  nextPage: number | null;
  previousPage: number | null;
  pageCount: number;
}

export interface Summary {
  free: number;
  paid: number;
}

export type PaginatedDTO<T> = {
  data: T[];
  meta: PaginationMeta;
  summary: Summary;
};
