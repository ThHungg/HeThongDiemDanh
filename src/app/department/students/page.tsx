import ContentHeader from "@/components/Common/ContentHeader";
import StudentsTable from "@/components/Department/Students/StudentsTable";
import { memo } from "react";

const StudentManagementPage = () => {
  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Quản lý sinh viên"
        showExport={true}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={true}
        onAdd={() => {}}
      />
      <StudentsTable />
    </div>
  );
};

export default memo(StudentManagementPage);
