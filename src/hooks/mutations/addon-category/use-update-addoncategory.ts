import * as z from "zod";
import { updateAddonCategory } from "@/actions/addon-category";
import { addonCategoryFormSchema } from "@/schemas/addon-category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateAddonCategoryResponse } from "@/types/addon-category";

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
