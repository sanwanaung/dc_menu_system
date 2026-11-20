import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormInput } from "@/features/addon/schema";
import { UpdateAddonResponse } from "@/features/addon/types";
import { updateAddon } from "@/features/addon/actions";

type Vars = { form: FormInput; id: string };

export const useUpdateAddonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateAddonResponse, Error, Vars>({
    mutationFn: ({ form, id }) => updateAddon({ form, id }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon"] });
      toast.success("Updated successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
