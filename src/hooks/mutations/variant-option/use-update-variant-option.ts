import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateVariantOption } from "@/actions/variant-option";
import { UpdateVariantOptionResponse } from "@/types/variant-option";
import { VariantOptionFormSchema } from "@/schemas/variant-option";

type Vars = { id: string; form: VariantOptionFormSchema };

export const useUpdateVariantOption = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateVariantOptionResponse, Error, Vars>({
    mutationFn: ({ id, form }) => updateVariantOption({ id, form }),
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
