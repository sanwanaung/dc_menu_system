"use client";

import { useOpenCartStore } from "@/hooks/client/use-open-cart-store";
import { useSelectedMenuStore } from "@/hooks/client/use-selected-menu-store";
import ClientProviders from "@/providers/client-providers";
import { Diamond, ShoppingCartIcon } from "lucide-react";
import React from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { selectedMenu } = useSelectedMenuStore();
  const { onOpenCart } = useOpenCartStore();
  return (
    <>
      <ClientProviders />
      <div className="min-h-dvh text-slate-900">
        <div className="flex min-h-dvh flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/20 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
              <div className="inline-flex items-center rounded">
                <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Diamond className="size-4" />
                </span>
                <span className="text-sm font-semibold tracking-wide">
                  Skyline Hub Hotel
                </span>
              </div>
              <button
                type="button"
                aria-label="Open cart"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 relative"
                onClick={onOpenCart}
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {selectedMenu && selectedMenu.length > 0 ? (
                  <span className="bg-red-500 absolute top-0 -right-2 text-white w-fit h-fit px-2 py-1 rounded-full text-xs">
                    {selectedMenu ? selectedMenu.length : 0}
                  </span>
                ) : null}
              </button>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto h-full max-w-6xl px-4 py-2 sm:px-6">
              <div className="h-full bg-background/20 p-2 sm:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ClientLayout;
