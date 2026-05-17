"use client";

import * as React from "react";
import Link from "next/link";
import { ConciergeBell, PhoneCall, UtensilsCrossed } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type RoomServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewMenu: () => void;
};

export function RoomServiceDialog({
  open,
  onOpenChange,
  onViewMenu,
}: RoomServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-amber-200/40 ring-1 ring-amber-300/40">
              <ConciergeBell className="size-4 text-foreground/80" />
            </span>
            Request Room Service
          </DialogTitle>
          <DialogDescription>
            Choose the fastest option — your comfort comes first.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Button
            className="h-11 justify-start rounded-2xl bg-amber-200/90 text-black hover:bg-amber-200"
            asChild
          >
            <Link href="tel:+9512300136">
              <PhoneCall className="mr-2 size-4" />
              Call Reception (+95 1 230 0136)
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-11 justify-start rounded-2xl"
            onClick={() => {
              onOpenChange(false);
              onViewMenu();
            }}
            type="button"
          >
            <UtensilsCrossed className="mr-2 size-4" />
            Browse Menu
          </Button>
        </div>

        <DialogFooter>
          <p className="mr-auto text-xs text-muted-foreground">
            24/7 service • delivery to your room
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

