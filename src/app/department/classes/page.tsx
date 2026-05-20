"use client";
import ContentHeader from "@/components/Common/ContentHeader";
import ClassesTable from "@/components/Department/Classes/ClassesTable";
import FilterBar from "@/components/Department/FilterBar";
import StudentsTable from "@/components/Department/Students/StudentsTable";
import { memo } from "react";

const ClassManagementPage = () => {
  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Quản lý lớp học"
        showExport={false}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={false}
        onAdd={() => {}}
      />
      <ClassesTable />
    </div>
  );
};

export default memo(ClassManagementPage);
