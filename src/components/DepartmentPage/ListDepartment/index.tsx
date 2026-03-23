import { memo } from "react";

const ListDepartment = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          className="w-full bg-white rounded-xl p-4 max-w-[300px]"
        >
          <div className="flex justify-between">
            <div className="p-2 bg-[#EFF6FF] rounded-lg w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="27"
                viewBox="0 0 24 24"
                className="text-[#1E40AF]"
              >
                <path
                  fill="currentColor"
                  d="M20 17.722c.595-.347 1-.985 1-1.722V5c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2v11c0 .736.405 1.375 1 1.722V18H2v2h20v-2h-2zM5 16V5h14l.002 11z"
                />
              </svg>
            </div>
            <div className="">
              <p className="px-2 py-1 bg-[#D1FAE5] rounded-2xl font-bold uppercase !text-[#047857] !text-[10px]">
                Đang hoạt động
              </p>
            </div>
          </div>
          <h5 className="!font-bold text-lg mt-2">Khoa công nghệ thông tin</h5>
          <p className="!text-[12px] text-[#64748B] mb-[24px]">
            Trưởng khoa: PGS.TS Nguyễn Văn A
          </p>
          <div className="flex justify-between">
            <p className="!text-[12px] !text-[#94A3B8] !font-semibold">
              Số lớp: <br /> <span className="font-bold text-black">12</span>
            </p>
            <p className="!text-[12px] !text-[#94A3B8] !font-semibold">
              Sinh viên: <br />{" "}
              <span className="font-bold text-black">380</span>
            </p>
          </div>
          <div className="flex justify-between items-center px-4 py-2 mt-4 bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0] cursor-pointer transition-colors">
            <p className="!text-[14px] font-semibold text-gray-700">
              Xem danh sách lớp
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              className="text-gray-600"
            >
              <path
                fill="currentColor"
                d="M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(ListDepartment);
