"use client";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import { memo } from "react";
import { toast } from "react-toastify";
import * as authService from "@/services/authenService";
import { useRouter } from "next/navigation";

const LayoutStudent = ({ children }: { children: React.ReactNode }) => {
  const logout = useMutationHooks(() => authService.logoutService());
  const router = useRouter();

  const handleLogout = () => {
    logout.mutate(null, {
      onSuccess: (res) => {
        toast.success(res.message || "Đăng xuất thành công!");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user-data");
        localStorage.removeItem("semester-data");
        router.push("/login");
      },
      onError: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user-data");
        localStorage.removeItem("semester-data");
        router.push("/login");
      },
    });
  };
  return (
    <>
      {/* Header */}
      <div className="bg-white flex items-center justify-between py-2 px-5 border-b-[1px] border-[#E2E8F0] shadow-xs">
        {" "}
        <div className="flex items-center justify-center gap-2 ">
          <img
            src="https://yt3.googleusercontent.com/bGfunjaNdyEf-iUzAbmY7zFHrDbd5toOKmaUk0ld2ehCx4bPWUKfAibz4yY693vY7oyRHZPy=s900-c-k-c0x00ffffff-no-rj"
            alt=""
            className="h-[40px] w-[40px]"
          />
          <div>
            <h6 className="!font-bold">Trường Đại học Thăng Long</h6>
            <p className="!text-[12px] text-[#737373] font-semibold">
              Hệ thống quản lý
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 ">
          {/* <div className="text-right">
            <h6 className="!font-bold">A46588</h6>
            <p className="!text-[12px] text-[#737373]">Đặng Thành Hưng</p>
          </div>
          <img
            src="https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"
            alt=""
            className="h-[50px] w-[50px]"
          /> */}
          <button onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M11 20a1 1 0 0 0-1-1H5V5h5a1 1 0 1 0 0-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5a1 1 0 0 0 1-1"
                  clipRule="evenodd"
                />
                <path d="M21.714 12.7a1 1 0 0 0 .286-.697v-.006a1 1 0 0 0-.293-.704l-4-4a1 1 0 1 0-1.414 1.414L18.586 11H9a1 1 0 1 0 0 2h9.586l-2.293 2.293a1 1 0 0 0 1.414 1.414l4-4z" />
              </g>
            </svg>
          </button>
        </div>
      </div>
      {/* Body */}
      {children}
    </>
  );
};

export default memo(LayoutStudent);
