import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteVariantOption } from "@/features/variant-option/actions";
import { DeleteVariantOptionResponse } from "@/features/variant-option/types";

type Vars = { id: string };

export const useDeleteVariantOptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteVariantOptionResponse, Error, Vars>({
    mutationFn: ({ id }) => deleteVariantOption({ id }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["variant-option"] });
      toast.success(`${data.message}`);
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
