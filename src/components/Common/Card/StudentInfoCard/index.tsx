import { memo } from "react";

const StudentInfoCard = () => {
  return (
    <div className="w-full mb-[24px] bg-white border border-[#E2E8F0] shadow-xs px-8 py-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        {" "}
        <img
          src="https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"
          alt=""
          className="h-[90px] w-[90px]"
        />
        <div className="space-y-0.5">
          <h6 className="font-bold">Đặng Thành Hưng</h6>
          <p className="text-[14px] font-semibold">A46588</p>
          <p className="px-2 py-1 bg-[#8B0000]/10 font-semibold w-fit rounded-2xl text-[12px] text-[#8B0000]">
            TT35CL07
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="py-4 px-6 rounded-3xl text-center bg-[#F7F2F2]">
          <p className="text-[12px] font-bold tracking-wider">Chuyên cần tb</p>
          <h6 className="font-bold text-[#8B0000] text-[14px]">9,5</h6>
        </div>
        <div className="py-4 px-6 rounded-3xl text-center bg-[#F7F2F2]">
          <p className="text-[12px] font-bold tracking-wider">Tổng số lớp</p>
          <h6 className="font-bold text-[14px]">9</h6>
        </div>
      </div>
    </div>
  );
};

export default memo(StudentInfoCard);
