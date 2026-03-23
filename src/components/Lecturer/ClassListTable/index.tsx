import { memo } from "react";

const ClassListTable = () => {
  return (
    <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      <div className="h-10"></div>
      <table className="w-full border border-gray-200 ">
        <thead className="text-[#64748B]">
          <tr className="bg-white">
            <th className="py-2">Mã lớp</th>
            <th className="py-2">Tên môn học</th>
            <th className="py-2">Phòng</th>
            <th className="py-2">Số lượng</th>
            <th className="py-2">Chuyên cần</th>
            <th className="py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SE312</td>
            <td>Kiểm thử và đảm bảo chất lượng</td>
          </tr>
        </tbody>
      </table>
      <div className="">Panigation</div>
    </div>
  );
};

export default memo(ClassListTable);
