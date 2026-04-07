import { memo } from "react";
import avatar from "../../../../../public/assets/Images/Avatar.png";

const AttendanceDetailModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-[800px] w-full bg-white rounded-lg ">
        {/* Header */}
        <div className="px-[24px] py-[12px] flex justify-between">
          <div className="flex items-center gap-2">
            <div>
              {" "}
              <img
                src={avatar.src}
                alt=""
                className="w-[55px] h-[55px] rounded-[12px] object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <h4 className="!font-bold text-[#8B0000]">Nguyễn Văn An</h4>
              <p className="text-[11px] whitespace-nowrap">
                Lớp: <span className="font-semibold">TT35CL07</span> MSV:{" "}
                <span className="font-semibold">A46588</span>
                <span>
                  {" "}
                  Ngành:{" "}
                  <span className="font-semibold">Công nghệ thông tin</span>
                </span>
              </p>
              <div className="flex gap-1">
                <p className="text-[11px]">
                  Số điện thoại:{" "}
                  <span className="font-semibold">0123456789</span>
                </p>{" "}
                <p className="text-[11px]">
                  Email:{" "}
                  <span className="font-semibold">a46588@thanglong.edu.vn</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-center">
              <h6 className="font-semibold text-[#737373] whitespace-nowrap">
                Điểm TB
              </h6>
              <p>9,1</p>
            </div>
            <div className="h-3/4 mx-4 border-l-1 rounded-2xl border-[#8B0000]/10"></div>
            <button className="text-[14px] flex items-center gap-2 text-white bg-[#8B0000] whitespace-nowrap font-semibold px-3 py-2 rounded-xl hover:bg-[#8B0000]/80 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M4 7H1a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2m-1 4H1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2m-.75 4H1a1 1 0 0 0 0 2h1.25a1 1 0 0 0 0-2m21.68-7.63a.15.15 0 0 0-.15 0l-8.32 7.31a2.4 2.4 0 0 1-1.55.61a1.73 1.73 0 0 1-1.36-.61L6.42 7.4a.14.14 0 0 0-.15 0a.2.2 0 0 0-.1.13l-1.43 9A1.25 1.25 0 0 0 6 18h15a1.8 1.8 0 0 0 1.72-1.5l1.28-9a.12.12 0 0 0-.07-.13"
                />
                <path
                  fill="currentColor"
                  d="M13.46 13.92a.94.94 0 0 0 1.32 0l8.28-7.27a.41.41 0 0 0 .14-.38C23.15 6 22.83 6 22.73 6H7.89a.56.56 0 0 0-.55.27a.33.33 0 0 0 0 .38Z"
                />
              </svg>
              Gửi Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AttendanceDetailModal);
