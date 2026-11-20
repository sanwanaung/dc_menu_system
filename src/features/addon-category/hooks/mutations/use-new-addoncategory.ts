import * as z from "zod";
import { createNewAddonCategory } from "@/features/addon-category/actions";
import { addonCategoryFormSchema } from "@/features/addon-category/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateNewAddonCategoryResponse } from "@/features/addon-category/types";

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
