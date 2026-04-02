import ContentHeader from "@/components/Common/ContentHeader";
import { memo } from "react";
import ClassListTable from "../ClassListTable";
import ClassCard from "@/components/Common/Card/ClassCard";

const LecturerClassView = () => {
  const classData = [
    {
      id: 1,
      code: "IS430",
      name: "Kiểm thử và đảm chất lượng phần mềm",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
    {
      id: 2,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
    {
      id: 1,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
    {
      id: 2,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
    {
      id: 1,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
    {
      id: 2,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
    {
      id: 1,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
    {
      id: 2,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
    },
  ];
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ">
        {classData.map((item, index) => (
          <ClassCard
            key={index}
            classCode={item.code}
            className={item.name}
            subjectClass={item.subjectClass}
            room={item.room}
            lecturer={item.lecturer}
          />
        ))}
      </div>
      {/* <ClassListTable /> */}
    </div>
  );
};

export default memo(LecturerClassView);
