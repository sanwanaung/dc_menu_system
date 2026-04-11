"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCancelRsMutation } from "@/hooks/mutations/room-service/use-cancel-rs";
import { useCancelRs } from "@/hooks/use-cancel-rs";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const CancellRsForm = () => {
  const { isOpen, onClose, id, status } = useCancelRs();
  const [option, setOption] = useState<string>("");
  const mutation = useCancelRsMutation();

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !mutation.isPending) onClose();
    },
    [onClose, mutation.isPending],
  );

  const handleCancelRs = async () => {
    if (!id || !status) return toast.error("Try again!");
    mutation.mutate({ id, status, option });
    if (!mutation.isPending || mutation.isError) {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-lg p-8"
          showCloseButton={false}
          onEscapeKeyDown={(e) => {
            if (mutation.isPending) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (mutation.isPending) e.preventDefault();
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
              disabled={mutation.isPending}
            />
          </div>
          <div className="flex gap-x-2">
            <Button
              size="lg"
              className="w-26"
              onClick={() => onClose()}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="w-26 bg-red-500 text-white hover:bg-red-400"
              disabled={mutation.isPending}
              onClick={handleCancelRs}
            >
              {mutation.isPending ? (
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
