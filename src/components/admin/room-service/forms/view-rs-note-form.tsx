"use client";

import { cancelRoomService, getRoomService } from "@/features/room-service/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useViewRsNotes } from "@/hooks/stores/use-view-rs";
import { RoomServiceOrder } from "generated/prisma/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const ViewRsForm = () => {
  const { isOpen, onClose, id } = useViewRsNotes();
  const [isLoading, setIsloading] = useState(false);
  const [note, setNote] = useState<RoomServiceOrder | null>(null);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    (async () => {
      if (!id) return;
      setIsloading(true);
      const rs = await getRoomService(id);
      if (rs.error || !rs.data) return toast.error(rs.error);
      setNote(rs.data);
      setIsloading(false);
    })();
  }, [id]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-lg p-8" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="font-semibold text-muted-foreground ">
              Special room service requests
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Textarea
              value={note?.notes ?? ""}
              className="min-h-30"
              placeholder="eg. Outside service hours or Staff unavailable"
              readOnly
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-x-2">
            <Button
              size="lg"
              className="w-26"
              onClick={() => onClose()}
              disabled={isLoading}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
