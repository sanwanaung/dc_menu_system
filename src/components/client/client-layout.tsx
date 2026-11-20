"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useOpenCartStore } from "@/hooks/stores/use-open-cart-store";
import { useSelectedMenuStore } from "@/hooks/stores/use-selected-menu-store";
import ClientProviders from "@/providers/client-providers";
import {
  ChevronLeft,
  ConciergeBell,
  Diamond,
  ShoppingCartIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import logo from "./../../../public/logo.png";
import Image from "next/image";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { selectedMenu } = useSelectedMenuStore();
  const { onOpenCart } = useOpenCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestRoomService = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("category");
    router.push(`/room-service?${next.toString()}`, { scroll: false });
  };

  return (
    <>
      <ClientProviders />
      <div className="min-h-dvh text-slate-900">
        <div className="flex min-h-dvh flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/20 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
              <div className="inline-flex items-center rounded gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  {/* <Diamond className="size-4" /> */}
                  <Image
                    src={logo}
                    alt="logo"
                    width={1000}
                    height={800}
                    className="w-full h-full rounded-full"
                  />
                </span>
                <span className="text-sm font-semibold tracking-wide">
                  Skyline Hub Hotel
                </span>
              </div>
              <div className="flex items-center gap-4">
                {pathname !== "/room-service" ? (
                  <Button variant="outline" onClick={requestRoomService}>
                    <ConciergeBell className="h-6 w-6" />
                    <span className="hidden md:block">
                      {" "}
                      Request Room Service
                    </span>
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => router.back()}>
                    <ChevronLeft className="h-6 w-6" />
                    Back to menu
                  </Button>
                )}
                {pathname !== "/room-service" && (
                  <Button
                    variant="outline"
                    size="icon-lg"
                    onClick={onOpenCart}
                    className="relative"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {selectedMenu && selectedMenu.length > 0 ? (
                      <span className="bg-red-500 absolute -top-2 -right-4 text-white w-fit h-fit px-2 py-1 rounded-full text-xs">
                        {selectedMenu ? selectedMenu.length : 0}
                      </span>
                    ) : null}
                  </Button>
                )}
              </div>
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
