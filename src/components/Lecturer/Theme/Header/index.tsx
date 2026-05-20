"use client";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import { memo } from "react";
import { toast } from "react-toastify";
import * as authService from "@/services/authenService";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const HeaderLecturer = () => {
  const logout = useMutationHooks(() => authService.logoutService());
  const router = useRouter();
  const { profile, clearProfile } = useUserStore();

  const handleLogout = () => {
    logout.mutate(null, {
      onSuccess: (res) => {
        clearProfile();
        toast.success(res.message || "Đăng xuất thành công!");
        router.push("/login");
      },
    });
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white sticky top-0 z-100 shadow-md flex items-center justify-between py-2 px-5 border-b-[1px] border-[#E2E8F0]">
      {" "}
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          src="https://cdn.haitrieu.com/wp-content/uploads/2021/12/Logo-DH-Thang-Long-TLU-V.png"
          alt=""
          className="h-[50px] w-full object-contain"
        />
        <div>
          {/* <h6 className="!font-bold">Phòng đào tạo</h6> */}
          <p className="!text-[12px] text-center font-semibold">
            Hệ thống chấm điểm danh
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#8B0000] flex items-center justify-center text-white font-semibold text-sm">
          {getInitials(profile?.ten)}
        </div>

        {/* User Name */}
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-800 line-clamp-1">
            {profile?.ten}
          </span>
          <span className="text-xs text-gray-500">
            {profile?.ma_giang_vien}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="hover:opacity-70 transition-opacity"
        >
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
  );
};

export default memo(HeaderLecturer);
