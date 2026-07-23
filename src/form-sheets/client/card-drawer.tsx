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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
  }).format(safe);
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
      <DrawerContent className="flex flex-col h-full w-[80%] md:w-1/2 bg-background p-0">
        <DrawerHeader className="px-6 pt-6 pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl font-semibold">
            <ShoppingCart className="size-5" />
            Review Order
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground mt-1">
            Review your selected items before placing the order.
          </DrawerDescription>
        </DrawerHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ShoppingCart className="size-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Add menu items to start an order.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 no-scrollbar">
            <div className="space-y-3 pb-4">
              {cartItems.map((item) => {
                const variantPrice = item.variantLinks.reduce(
                  (sum, variant) => sum + variant.variantOption.price,
                  0,
                );
                const unitPrice = item.price + variantPrice;
                const subtotal = unitPrice * item.quantity;

                const imageUrl =
                  item.imageType === "BASE_IMAGE"
                    ? item.baseImage || ""
                    : item.variantLinks[0]?.variantImage[0]?.url || "";

                return (
                  <div
                    key={item.orderId}
                    className="rounded-2xl border border-border/60 bg-card shadow-sm p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-20 h-32 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-muted relative">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingCart className="size-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 -mr-1 -mt-1 text-muted-foreground hover:text-destructive"
                            onClick={() => removeSelectedMenu(item.orderId)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>

                        {item.variantLinks.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.variantLinks.map((variant) => (
                              <span
                                key={variant.id}
                                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium"
                              >
                                {variant.variantOption.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="mt-2 text-sm text-muted-foreground">
                          {formatMoney(unitPrice)}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 rounded-r-none"
                              onClick={() =>
                                updateQuantity(item.orderId, "decrease")
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="size-4" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium tabular-nums select-none">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 rounded-l-none"
                              onClick={() =>
                                updateQuantity(item.orderId, "increase")
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                          <span className="font-semibold text-sm">
                            {formatMoney(subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <DrawerFooter className="sticky bottom-0 bg-background border-t px-6 py-3 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatMoney(subTotalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commercial Tax</span>
                <span>10%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Charges</span>
                <span>5%</span>
              </div>
              <div className="flex justify-between pt-2 border-t text-base font-semibold">
                <span>Total</span>
                <span>{formatMoney(totalPrice)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full font-semibold" disabled>
              Place Order
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
