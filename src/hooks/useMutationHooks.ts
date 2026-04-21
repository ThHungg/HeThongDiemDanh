import { useMutation, MutationFunction } from "@tanstack/react-query";
import { toast } from "react-toastify";

// TData: Kiểu dữ liệu trả về từ API
// TVariables: Kiểu dữ liệu truyền vào hàm (ví dụ: string hoặc {msv, otp})
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
