import ClassCard from "@/components/Common/Card/ClassCard";
import ContentHeader from "@/components/Common/ContentHeader";
import { memo } from "react";

const LecturerClassesPage = () => {
  const classData = [
    {
      id: 1,
      code: "IS430",
      name: "Kiểm thử và đảm bảo chất lượng phần mềm",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
    },
    {
      id: 2,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 3, Tiết 4-5",
    },
    {
      id: 3,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 4, Tiết 1-3\nThứ 6, Tiết 1-3",
    },
    {
      id: 4,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
    },
    {
      id: 5,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 5, Tiết 7-9",
    },
    {
      id: 6,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
    },
    {
      id: 7,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 3, Tiết 1-3\nThứ 5, Tiết 1-2",
    },
    {
      id: 8,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
    },
  ];
  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Quản lý danh sách lớp học"
        showExport={true}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={false}
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
            classSchedule={item.schedule}
            lecturer={item.lecturer}
          />
        ))}
      </div>
      {/* <ClassListTable /> */}
    </div>
  );
};

export default memo(LecturerClassesPage);
