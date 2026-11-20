import * as z from "zod";
import { updateAddonCategory } from "@/features/addon-category/actions";
import { addonCategoryFormSchema } from "@/features/addon-category/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateAddonCategoryResponse } from "@/features/addon-category/types";

type FormInput = z.input<typeof addonCategoryFormSchema>;

type Vars = { id: string; form: FormInput };

export const useUpdateAddonCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateAddonCategoryResponse, Error, Vars>({
    mutationFn: ({ id, form }) => updateAddonCategory(id, form),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon-category"] });
      toast.success("Updated Successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
