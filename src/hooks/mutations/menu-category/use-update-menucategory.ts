import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMenuCategory } from "@/actions/menu-category";
import { menuCategoryFormSchema } from "@/schemas/menu-category";
import { UpdateMenuCategoryResponse } from "@/types/menu-category";

type FormInput = z.input<typeof menuCategoryFormSchema>;

type Vars = { id: string; form: FormInput };

export const useUpdateMenuCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMenuCategoryResponse, Error, Vars>({
    mutationFn: ({ id, form }) => updateMenuCategory(id, form),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["menu-category"] });
      toast.success("Updated Successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
