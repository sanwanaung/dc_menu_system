import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateMenuCategoryResponse } from "@/features/menu-category/types";
import { createNewMenuCategory } from "@/features/menu-category/actions";
import { menuCategoryFormSchema } from "@/features/menu-category/schema";

type FormInput = z.input<typeof menuCategoryFormSchema>;

type Vars = { form: FormInput };

export const useNewMenuCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateMenuCategoryResponse, Error, Vars>({
    mutationFn: ({ form }) => createNewMenuCategory(form),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["menu-category"] });
      toast.success("New addoncategory is added successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
