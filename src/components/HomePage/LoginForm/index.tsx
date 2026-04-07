"use client";
import { memo, useState } from "react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  return (
    <div className="mb-[12px]">
      <div className="flex flex-col mb-[12px]">
        <label htmlFor="email" className="text-[14px] font-bold mb-[4px]">
          Email sinh viên
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <path
              fill="currentColor"
              d="m16.484 11.976l6.151-5.344v10.627zm-7.926.905l2.16 1.875c.339.288.781.462 1.264.462h.017h-.001h.014c.484 0 .926-.175 1.269-.465l-.003.002l2.16-1.875l6.566 5.639H1.995zM1.986 5.365h20.03l-9.621 8.356a.6.6 0 0 1-.38.132h-.014h.001h-.014a.6.6 0 0 1-.381-.133l.001.001zm-.621 1.266l6.15 5.344l-6.15 5.28zm21.6-2.441c-.24-.12-.522-.19-.821-.19H1.859a1.9 1.9 0 0 0-.835.197l.011-.005A1.86 1.86 0 0 0 0 5.855v12.172a1.86 1.86 0 0 0 1.858 1.858h20.283a1.86 1.86 0 0 0 1.858-1.858V5.855c0-.727-.419-1.357-1.029-1.66l-.011-.005z"
            />
          </svg>
          <input
            type="text"
            id="email"
            placeholder="Vui lòng nhập email của bạn"
            className="bg-[#F8FAFC] text-[14px] pl-10 py-3 rounded-2xl w-full border border-[#E2E8F0] ring-1 ring-transparent focus:ring-[#8B0000] transition-all outline-none"
          />
        </div>
      </div>
      {/* <div className="flex flex-col">
        <label htmlFor="password" className="text-[14px] font-bold mb-[4px]">
          Mật khẩu
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 256 256"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <path
              fill="currentColor"
              d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16M96 56a32 32 0 0 1 64 0v24H96Zm112 152H48V96h160zm-68-56a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
            />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Vui lòng nhập mật khẩu của bạn"
            className="bg-[#F8FAFC] text-[14px] pl-10 py-2 rounded-2xl w-full border border-[#E2E8F0]"
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 6.362A9.7 9.7 0 0 1 12 5c6.307 0 9.367 5.683 9.91 6.808c.06.123.06.261 0 .385c-.352.728-1.756 3.362-4.41 5.131M14 18.8a10 10 0 0 1-2 .2c-6.307 0-9.367-5.683-9.91-6.808a.44.44 0 0 1 0-.386c.219-.452.84-1.632 1.91-2.885m6 .843A3 3 0 0 1 14.236 14M3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M12 5c-6.307 0-9.367 5.683-9.91 6.808a.44.44 0 0 0 0 .384C2.632 13.317 5.692 19 12 19s9.367-5.683 9.91-6.808a.44.44 0 0 0 0-.384C21.368 10.683 18.308 5 12 5" />
                  <circle cx="12" cy="12" r="3" />
                </g>
              </svg>
            )}
          </button>
        </div>
      </div> */}
      {/* <div className="flex items-center justify-between mt-[8px]">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            checked={rememberPassword}
            onChange={(e) => setRememberPassword(e.target.checked)}
            className="mr-2 rounded-full"
          />
          <label htmlFor="remember" className="text-[14px] text-gray-600">
            Ghi nhớ đăng nhập
          </label>
        </div>
      </div> */}
    </div>
  );
};

export default memo(LoginForm);
