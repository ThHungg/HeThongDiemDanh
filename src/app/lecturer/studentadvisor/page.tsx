"use client";
import ContentHeader from "@/components/Common/ContentHeader";
import SearchBar from "@/components/Lecturer/SearchBar";
import StudentAdvisorTable from "@/components/Lecturer/StudentAdvisorTable";
import { memo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as classService from "@/services/classService";
import { useSemesterStore } from "@/store/useSemesterStore";
import Loading from "@/components/Common/Loading";

const StudentAdvisorPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const semester = useSemesterStore((state) => state.selectedSemester);

  const getClassesByAdvisor = async () => {
    const res = await classService.getClassesByAdvisorService(semester);
    return res;
  };

  const {
    data: classesData,
    isLoading: classesLoading,
    error: classesError,
  } = useQuery({
    queryKey: ["advisor-classes", semester],
    queryFn: getClassesByAdvisor,
  });

  const classes = classesData?.data || [];

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

      <SearchBar
        onSearchChange={setSearchValue}
        onClassChange={setSelectedClass}
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        semester={semester}
      />
      <StudentAdvisorTable
        searchValue={searchValue}
        selectedClass={selectedClass}
        semester={semester}
      />
    </div>
  );
};

export default memo(StudentAdvisorPage);
