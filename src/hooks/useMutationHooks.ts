import { useMutation, MutationFunction } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useMutationHooks = <TData, TVariables>(
  fnCallback: MutationFunction<TData, TVariables>,
) => {
  return useMutation({
    mutationFn: fnCallback,
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Đã có lỗi xảy ra!";
      toast.error(message);
    },
  });
};
