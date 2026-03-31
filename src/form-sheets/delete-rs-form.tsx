"use client";

import { deleteRoomService } from "@/actions/room-service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteRs } from "@/hooks/use-delete-rs";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const DeleteRsForm = () => {
  const { isOpen, onClose, id } = useDeleteRs();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isSubmitting) onClose();
    },
    [onClose, isSubmitting],
  );

  const handleDelete = async () => {
    if (!id) return;
    setIsSubmitting(true);
    const room = await deleteRoomService(id);
    if (room.error) toast.error(room.error);
    toast.success(room.message);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-lg"
          showCloseButton={false}
          onEscapeKeyDown={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
        >
          <DialogHeader className="text-center my-2">
            <DialogTitle className="font-semibold text-lg flex  gap-2 items-center justify-center ">
              <AlertCircleIcon className="size-5 text-destructive" />
              Are you sure to delete!
            </DialogTitle>
            <DialogDescription>
              This action can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-x-3 my-4">
            <Button size="lg" className="w-26" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="w-26 bg-red-500 text-white hover:bg-red-400"
              onClick={handleDelete}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
