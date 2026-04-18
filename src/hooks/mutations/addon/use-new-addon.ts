import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormInput } from "@/schemas/addon";
import { CreateAddonResponse } from "@/types/addon";
import { createNewAddon } from "@/actions/addon";

type Vars = { form: FormInput };

export const useNewAddonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateAddonResponse, Error, Vars>({
    mutationFn: ({ form }) => createNewAddon(form),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon"] });
      toast.success("New addon is added successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
