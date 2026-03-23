import ContentHeader from "@/components/Common/ContentHeader";
import { memo } from "react";
import ClassListTable from "../ClassListTable";

const LecturerClassView = () => {
  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Quản lý danh sách lớp học"
        showExport={true}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={true}
        onAdd={() => {}}
      />
      <ClassListTable />
    </div>
  );
};

export default memo(LecturerClassView);
