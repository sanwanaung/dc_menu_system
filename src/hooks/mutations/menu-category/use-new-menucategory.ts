import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateMenuCategoryResponse } from "@/types/menu-category";
import { createNewMenuCategory } from "@/actions/menu-category";
import { menuCategoryFormSchema } from "@/schemas/menu-category";

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
