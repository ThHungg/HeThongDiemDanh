"use client";
import ContentHeader from "@/components/Common/ContentHeader";
import FilterBar from "@/components/Department/FilterBar";
import StudentsTable from "@/components/Department/Students/StudentsTable";
import { memo, useState } from "react";

const StudentManagementPage = () => {
  const [searchValue, setSearchValue] = useState("A46588");

  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Quản lý sinh viên"
        showExport={true}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={false}
        onAdd={() => {}}
      />
      <FilterBar onSearchChange={setSearchValue} />
      <StudentsTable searchValue={searchValue} />
    </div>
  );
};

export default memo(StudentManagementPage);
