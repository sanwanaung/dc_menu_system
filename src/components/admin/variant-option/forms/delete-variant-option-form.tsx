"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteVariantOptionMutation } from "@/features/variant-option/hooks/mutations/use-delete-variant-option";
import { useVariantOption } from "@/hooks/stores/use-variant-option";

import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useCallback } from "react";

const DeleteVariantOptionForm = () => {
  const { isDelete, onClose, id } = useVariantOption();
  const mutation = useDeleteVariantOptionMutation();

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !mutation.isPending) onClose();
    },
    [onClose, mutation.isPending],
  );

  const handleDelete = () => {
    if (!id) return;
    mutation.mutate({ id });
    if (!mutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isDelete} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          if (mutation.isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (mutation.isPending) e.preventDefault();
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
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVariantOptionForm;
