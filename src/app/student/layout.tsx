import { memo } from "react";

const LayoutStudent = ({ children }: { children: React.ReactNode }) => {
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
            <p className="!text-[12px] text-[#737373] font-semibold">Hệ thống quản lý</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <div className="text-right">
            <h6 className="!font-bold">A46588</h6>
            <p className="!text-[12px] text-[#737373]">Đặng Thành Hưng</p>
          </div>
          <img
            src="https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"
            alt=""
            className="h-[50px] w-[50px]"
          />
        </div>
      </div>
      {/* Body */}
      {children}
    </>
  );
};

export default memo(LayoutStudent);
