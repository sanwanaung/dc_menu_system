import { create } from "zustand";

type MenuVariantImage = { id: string; url: string };

type MenuVariantOption = {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
  isAvailable: boolean;
};

type MenuVariantLink = {
  id: string;
  variantOption: MenuVariantOption;
  variantImage: MenuVariantImage[];
};

export type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  baseImage: string | null;
  imageType: "BASE_IMAGE" | "VARIANT_IMAGE";
  ratingAverage: number;
  ratingCount: number;
  variantLinks: MenuVariantLink[];
  orderId: string;
  quantity: number;
};

type SelectedMenus = {
  selectedMenu: MenuItemData[] | null;
  addSelectedMenu: (menu: MenuItemData) => void;
  removeSelectedMenu: (orderId: string) => void;
  updateQuantity: (
    orderId: string,
    actionType: "increase" | "decrease",
  ) => void;
};

export const useSelectedMenuStore = create<SelectedMenus>((set) => ({
  selectedMenu: null,
  addSelectedMenu: (menu) =>
    set((state) => {
      const selectedMenus = state.selectedMenu || [];

      const existingMenu = selectedMenus.find(
        (m) =>
          m.id === menu.id &&
          m.variantLinks.every((variant) =>
            menu.variantLinks.some((v) => v.id === variant.id),
          ),
      );

      if (existingMenu) {
        return {
          selectedMenu: selectedMenus.map((m) =>
            m.orderId === existingMenu.orderId
              ? {
                  ...m,
                  quantity: m.quantity + 1,
                }
              : m,
          ),
        };
      }

      return {
        selectedMenu: [...selectedMenus, menu],
      };
    }),
  removeSelectedMenu: (orderId: string) =>
    set((state) => ({
      selectedMenu: state.selectedMenu
        ? state.selectedMenu.filter((menu) => menu.orderId !== orderId)
        : null,
    })),
  updateQuantity: (orderId: string, actionType: "increase" | "decrease") =>
    set((state) => ({
      selectedMenu: state.selectedMenu
        ? state.selectedMenu.map((item) => {
            return item.orderId === orderId
              ? {
                  ...item,
                  quantity:
                    actionType === "increase"
                      ? item.quantity + 1
                      : item.quantity === 0
                        ? item.quantity
                        : item.quantity - 1,
                }
              : { ...item };
          })
        : state.selectedMenu,
    })),
}));
