"use client";
import { memo } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { usePathname } from "next/navigation";

const MasterLayout = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/student" ||
    pathname === "/403" ||
    pathname === "/404"
  ) {
    return <div className="">{children}</div>;
  }
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default memo(MasterLayout);
