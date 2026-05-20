"use client";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import formatTime from "@/utils/formatTime";
import { memo, useEffect, useRef, useState } from "react";
import * as authService from "@/services/authenService";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Loading from "../../Loading";
import * as classService from "@/services/classService";

const VerifyOtpModal = ({
  onClose,
  userCode,
}: {
  onClose: () => void;
  userCode: string;
}) => {
  const setProfile = useUserStore((state) => state.setProfile);
  const router = useRouter();
  const [time, setTime] = useState(300);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (time === 0) return;
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
  }, [time]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const hadnleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("Text").slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newOtp = data.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    inputRef.current[newOtp.length - 1]?.focus();
  };

  const verifyOtp = useMutationHooks(
    (data: { userCode: string; otp: string }) =>
      authService.verifyOtpService(data.userCode, data.otp),
  );

  const handleVerify = async (data: { userCode: string; otp: string }) => {
    verifyOtp.mutate(data, {
      onSuccess: async (res: any) => {
        toast.success(res.message || "Xác thực OTP thành công!");
        localStorage.setItem("accessToken", res.accessToken);
        setProfile(res.filteredInfo);
        if (
          res.filteredInfo.role === "Quan_tri" ||
          res.filteredInfo.role === "Thu_ky"
        ) {
          router.push("/department/classes");
        }
        if (
          res.filteredInfo.role === "Giang_vien" ||
          res.filteredInfo.role === "Thinh_giang"
        ) {
          const currentClassesRes = await classService.getCurrentClass();
          console.log("Current classes:", currentClassesRes);
          if (currentClassesRes?.data.length > 0) {
            router.push(
              `/lecturer/classes/${currentClassesRes.data[0].maLopHocPhan}`,
            );
          } else {
            router.push("/lecturer/classes");
          }
        }
        if (res.filteredInfo.role === "Sinh_vien") {
          router.push("/student");
        }
      },
      onError: (err: any) => {
        setOtp(Array(6).fill(""));
      },
    });
  };

  const { mutate: resendOtp, isPending: isResending } = useMutationHooks(
    (userCode: string) => authService.loginService(userCode),
  );

  const handleResendOtp = () => {
    resendOtp(userCode, {
      onSuccess: (res: any) => {
        toast.success(res.message || "Mã OTP đã được gửi lại thành công!");
        setTime(300);
        setOtp(Array(6).fill(""));
      },
    });
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
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => hadnleKeyDown(e, index)}
              onPaste={handPaste}
              className="w-12 h-12 rounded-xl text-center text-xl font-bold focus:border-[#8B0000] focus:outline-none bg-[#8B0000]/10"
            />
          ))}
        </div>{" "}
        <button
          onClick={() => handleVerify({ userCode, otp: otp.join("") })}
          className="mb-3 mt-6 w-2/3 mx-auto px-6 py-3 font-semibold bg-[#8B0000] text-white rounded-xl hover:bg-[#8B0000]/80 focus:outline-none"
        >
          Xác thực
        </button>
        <div className="space-y-1">
          <p className="text-[12px] flex justify-center gap-1 items-center">
            {time > 0 ? (
              <>
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
              </>
            ) : (
              <button
                className="text-[#737373] text-[14px] hover:text-[#8B0000] font-bold cursor-pointer ml-1"
                onClick={handleResendOtp}
              >
                {isResending ? (
                  <Loading text="Đang gửi..." />
                ) : (
                  "Gửi lại mã OTP"
                )}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(VerifyOtpModal);
