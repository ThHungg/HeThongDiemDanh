"use client";
import ContentHeader from "@/components/Common/ContentHeader";
import FilterBar from "@/components/Department/FilterBar";
import StudentsTable from "@/components/Department/Students/StudentsTable";
import { memo, useState } from "react";

const StudentManagementPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<{
    startDate?: string;
    endDate?: string;
    minScore?: string;
    maxScore?: string;
  }>({});

  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Quản lý sinh viên"
        showExport={false}
        onExport={() => {}}
      />
      <FilterBar onSearchChange={setSearchValue} onFilterChange={setFilters} />
      <StudentsTable searchValue={searchValue} filters={filters} />
    </div>
  );
};

export default memo(StudentManagementPage);
