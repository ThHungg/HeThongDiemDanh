import { memo } from "react";
import HeaderLecturer from "@/components/Lecturer/Theme/Header";

const LayoutLecturer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      {/* <HeaderLecturer /> */}
      {children}
    </div>
  );
};

export default memo(LayoutLecturer);
