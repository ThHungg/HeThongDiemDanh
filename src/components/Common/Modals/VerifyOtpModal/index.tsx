"use client";
import formatTime from "@/utils/formatTime";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

const VerifyOtpModal = ({ onClose }: { onClose: () => void }) => {
  const [time, setTime] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="text-center relative py-6 px-2 bg-white rounded-2xl w-full max-w-[450px]">
        <button className="absolute top-4 right-4" onClick={onClose}>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m7 7l10 10M7 17L17 7"
            />
          </svg>
        </button>
        <div className="px-12 mb-[12px]">
          <h3 className="text-[#8B0000] mb-[8px]">Xác thực OTP</h3>

          <p className="text-[13px] text-[#1E293B]">
            Mã xác thực đã được gửi đến email của bạn.
            <br />
            Vui lòng nhập để tiếp tục.
          </p>
        </div>
        <div className="flex justify-center w-full gap-2 ">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 rounded-xl text-center text-xl font-bold focus:border-[#8B0000] focus:outline-none bg-[#8B0000]/10"
              />
            ))}
        </div>
        <Link href="/lecturer/classes">
          {" "}
          <button className="mb-3 mt-6 w-2/3 mx-auto px-6 py-3 font-semibold bg-[#8B0000] text-white rounded-xl hover:bg-[#8B0000]/80 focus:outline-none">
            Xác thực
          </button>
        </Link>
        <div className="space-y-1">
          <p className="text-[12px] flex justify-center gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M15.098 12.634L13 11.423V7a1 1 0 0 0-2 0v5a1 1 0 0 0 .5.866l2.598 1.5a1 1 0 1 0 1-1.732M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8.01 8.01 0 0 1-8 8"
              />
            </svg>
            Gửi lại mã sau{" "}
            <span className="text-[#8B0000]">{formatTime(time)}</span>
          </p>
          <p className="text-[#737373] hover:text-[#8B0000] font-bold cursor-pointer">
            Gửi lại mã
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(VerifyOtpModal);
