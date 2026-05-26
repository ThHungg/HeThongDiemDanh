"use client";
import ContentHeader from "@/components/Common/ContentHeader";
import SearchBar from "@/components/Lecturer/SearchBar";
import StudentAdvisorTable from "@/components/Lecturer/StudentAdvisorTable";
import { memo, useState } from "react";

const StudentAdvisorPage = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Lớp cố vấn học tập"
        showExport={false}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={false}
        onAdd={() => {}}
      />
      <SearchBar onSearchChange={setSearchValue} />
      <StudentAdvisorTable searchValue={searchValue} />
    </div>
  );
};

export default memo(StudentAdvisorPage);
