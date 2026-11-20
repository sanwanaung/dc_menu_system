import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VariantOptionFormSchema } from "@/features/variant-option/schema";
import { createNewVariantOption } from "@/features/variant-option/actions";
import { CreateVariantOptionResponse } from "@/features/variant-option/types";

type Vars = { form: VariantOptionFormSchema };

export const useNewVariantOptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateVariantOptionResponse, Error, Vars>({
    mutationFn: ({ form }) => createNewVariantOption({ form }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["variant-option"] });
      toast.success("New variant option is added successfully!");
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
