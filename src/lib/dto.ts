import { Addon } from "@/features/addon/types";

export function toDTO(data: Addon) {
  return {
    ...data,
    price: Number(data.price),
  };
}
