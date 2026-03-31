"use client";

import {
  cancelRoomService,
  updateRoomServiceStatus,
} from "@/actions/room-service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCancelRs } from "@/hooks/use-cancel-rs";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const CancellRsForm = () => {
  const { isOpen, onClose, id, status } = useCancelRs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [option, setOption] = useState<string>("");

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isSubmitting) onClose();
    },
    [onClose, isSubmitting],
  );

  const handleCancelRs = async () => {
    setIsSubmitting(true);
    if (!id || !status) return toast.error("Try again!");
    const result = await cancelRoomService(id, status, option);
    if (result.error) return toast.error(result.error);
    toast.success(`Marked as ${status}`);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-lg p-8"
          showCloseButton={false}
          onEscapeKeyDown={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-semibold text-muted-foreground ">
              Cancellation reasons (optional)
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Textarea
              className="min-h-50"
              placeholder="eg. Outside service hours or Staff unavailable"
              onChange={(e) => setOption(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-x-2">
            <Button
              size="lg"
              className="w-26"
              onClick={() => onClose()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="w-26 bg-red-500 text-white hover:bg-red-400"
              disabled={isSubmitting}
              onClick={handleCancelRs}
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
