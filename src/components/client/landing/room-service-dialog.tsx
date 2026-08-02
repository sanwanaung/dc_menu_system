"use client";

import { BrushCleaning, ConciergeBell, UtensilsCrossed } from "lucide-react";
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
  veiewMenu: () => void;
  requestRoomService: () => void;
};

export function RoomServiceDialog({
  open,
  onOpenChange,
  veiewMenu,
  requestRoomService,
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
            onClick={requestRoomService}
          >
            <BrushCleaning />
            Request Room Service
          </Button>

          <Button
            variant="outline"
            className="h-11 justify-start rounded-2xl"
            onClick={veiewMenu}
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
