"use client";
import { memo, useState } from "react";
import LoginForm from "../LoginForm";
import VerifyOtpModal from "@/components/Common/Modals/VerifyOtpModal";

const AuthCard = () => {
  const [openModalOtp, setOpenModalOtp] = useState(false);
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg min-w-[400px]">
      <div className="flex flex-col items-center gap-2 mb-[12px]">
        <div className="p-3 bg-[#8B0000]/10 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            className="text-[#8B0000]"
          >
            <g fill="none">
              <path d="M2 8.5L12 2l10 6.5l-4 2.6l-6 3.9l-6-3.9z" />
              <path d="M6 17.5v-6.4l6 3.9l6-3.9v6.4c0 1.933-2.686 3.5-6 3.5s-6-1.567-6-3.5" />
              <path
                stroke="currentColor"
                strokeLinecap="square"
                strokeWidth="2"
                d="M21 9.15V15M6 11.1v6.4c0 1.933 2.686 3.5 6 3.5s6-1.567 6-3.5v-6.4L12 15zM12 2L2 8.5L12 15l10-6.5z"
              />
            </g>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-[#8B0000] font-semibold">Hệ thống điểm danh</h3>
          <p className="text-[11px]">Hệ thống quản lý điểm danh thông minh</p>
        </div>
      </div>
      <LoginForm />
      <button
        onClick={() => setOpenModalOtp(true)}
        className="w-full py-2 flex items-center justify-center gap-2 bg-[#8B0000] text-white font-semibold rounded-2xl shadow-md "
      >
        Gửi mã xác thực
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
          />
        </svg>
      </button>
      {openModalOtp && (
        <VerifyOtpModal onClose={() => setOpenModalOtp(false)} />
      )}
    </div>
  );
};

export default memo(AuthCard);
