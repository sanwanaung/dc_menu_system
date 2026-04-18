import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormInput } from "@/schemas/addon";
import { UpdateAddonResponse } from "@/types/addon";
import { updateAddon } from "@/actions/addon";

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
