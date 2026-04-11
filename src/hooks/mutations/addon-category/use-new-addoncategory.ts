import * as z from "zod";
import { createNewAddonCategory } from "@/actions/addon-category";
import { addonCategoryFormSchema } from "@/schemas/addon-category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateNewAddonCategoryResponse } from "@/types/addon-category";

type FormInput = z.input<typeof addonCategoryFormSchema>;

type Vars = { form: FormInput };

export const useNewAddonCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateNewAddonCategoryResponse, Error, Vars>({
    mutationFn: ({ form }) => createNewAddonCategory(form),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon-category"] });
      toast.success("New addoncategory is added successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
