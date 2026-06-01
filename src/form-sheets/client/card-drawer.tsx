"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import { useOpenCartStore } from "@/hooks/client/use-open-cart-store";
import { useSelectedMenuStore } from "@/hooks/client/use-selected-menu-store";
import Image from "next/image";

export function formatMoney(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  const formated = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
  }).format(safe);

  return formated;
}

export default function CartDrawer() {
  const { isOpen, onCloseCart } = useOpenCartStore();

  const { selectedMenu, removeSelectedMenu, updateQuantity } =
    useSelectedMenuStore();

  const cartItems = selectedMenu ?? [];

  const subTotalPrice = cartItems.reduce((acc, item) => {
    const variantPrice = item.variantLinks.reduce(
      (sum, variant) => sum + variant.variantOption.price,
      0,
    );

    return acc + (item.price + variantPrice) * item.quantity;
  }, 0);

  const totalPrice =
    subTotalPrice + (subTotalPrice * 0.1 + subTotalPrice * 0.05);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onCloseCart()}
      direction="right"
    >
      <DrawerContent className="py-1 px-2 w-[50%]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Review Order
          </DrawerTitle>
          <DrawerDescription>
            Review your selected items before placing the order.
          </DrawerDescription>
        </DrawerHeader>

        {cartItems.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center px-4 text-center">
            <ShoppingCart className="mb-3 size-10 text-muted-foreground" />
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add menu items to start an order.
            </p>
          </div>
        ) : (
          //   <ScrollArea className="px-4">
          //   </ScrollArea>
          <div className="space-y-2 pb-4 no-scrollbar overflow-y-auto">
            {cartItems.map((item) => {
              const variantPrice = item.variantLinks.reduce(
                (sum, variant) => sum + variant.variantOption.price,
                0,
              );

              const unitPrice = item.price + variantPrice;
              const subtotal = unitPrice * item.quantity;

              return (
                <div key={item.orderId} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <div className="w-16 h-16">
                        <Image
                          src={
                            item.imageType === "BASE_IMAGE"
                              ? item.baseImage
                                ? item.baseImage
                                : ""
                              : item.variantLinks[0].variantImage[0].url
                          }
                          alt={item.name}
                          className="w-full h-full rounded-md object-cover"
                          width={800}
                          height={800}
                        />
                      </div>
                      <div>
                        <h3 className="truncate font-medium">{item.name}</h3>
                        {item.variantLinks.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.variantLinks.map((variant) => (
                              <span
                                key={variant.id}
                                className="rounded-md bg-muted px-2 py-1 text-xs"
                              >
                                {variant.variantOption.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 text-sm text-muted-foreground">
                          {formatMoney(unitPrice)}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSelectedMenu(item.orderId)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.orderId, "decrease")}
                      >
                        <Minus className="size-4" />
                      </Button>

                      <span className="min-w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.orderId, "increase")}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    <div className="font-semibold">
                      ${formatMoney(subtotal)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {cartItems.length > 0 && (
          <DrawerFooter className="border-t">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal : </span>
                <span>{formatMoney(subTotalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Commercial Tax : </span>
                <span>10%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Service Charges : </span>
                <span>5%</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Toal : </span>
                <span>{formatMoney(totalPrice)}</span>
              </div>
            </div>

            <Button size="sm" className="w-full" disabled>
              Place Order
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
