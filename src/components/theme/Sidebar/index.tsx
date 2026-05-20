"use client";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import { useUserHooks } from "@/hooks/useUserHooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useState } from "react";
import * as authService from "@/services/authenService";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/useUserStore";

const Sidebar = () => {
  const pathname = usePathname();
  const { role } = useUserHooks();
  const router = useRouter();
  const { profile, clearProfile } = useUserStore();

  // const [isSelected, setIsSelected] = useState("/");

  const logout = useMutationHooks(() => authService.logoutService());

  const handleLogout = () => {
    logout.mutate(null, {
      onSuccess: (res) => {
        clearProfile();
        toast.success(res.message || "Đăng xuất thành công!");
        router.push("/login");
      },
    });
  };
  const commonMenu = [
    {
      name: "Tổng quan",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M2.5 5.5v-3h3v3zM1 2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm8 .25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.25M9.75 5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zM2.5 10.5v3h3v-3zM2 9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zm7.75.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      link: "/",
    },
  ];

  const menuSidebar = {
    Department: [
      // ...commonMenu,
      {
        name: "Quản lý lớp học",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 32 32"
          >
            <g fill="currentColor">
              <path d="M28.99 30V16.98c0-.54-.44-.99-.99-.99h-8V12h2v1.19c0 .45.36.81.8.81h3.39c.45 0 .81-.36.81-.8V4.81c0-.45-.36-.81-.8-.81h-3.39c-.45 0-.81.36-.81.81V6h-2V2.92c0-.51-.41-.92-.92-.92H3.92c-.51 0-.92.41-.92.92v27.06h1.98v-4.95c0-.57.46-1.03 1.03-1.03h10.96c.57 0 1.03.46 1.03 1.03V30h-.99v-4.65c0-.19-.15-.35-.35-.35h-2.28c-.19 0-.35.15-.35.35V30H11zM20 27.01V24h1.5c.28 0 .5.23.5.5v2c0 .28-.22.5-.5.51zm0-5V19h1.5c.28 0 .5.23.5.5v2c0 .28-.22.5-.5.51zM22 11h-2V7h2zm5 8.5v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0 5v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V24.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m-13.99-20v2c0 .28-.22.5-.5.5h-2.02c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0 7c0 .28-.22.5-.5.5h-2.02c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0 3v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V14.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0 5v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m5.01 2c0 .28-.23.5-.5.51H15.5c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.23.5-.5.51H15.5c-.28 0-.5-.23-.5-.5V14.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0-3c0 .28-.23.5-.5.5H15.5c-.28 0-.5-.23-.5-.5v-2c0-.28.22-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.23.5-.5.5H15.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5h2.02c.28 0 .5.23.5.5m-10.01 17c0 .28-.22.5-.5.51H5.49c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.22.5-.5.51H5.49c-.28 0-.5-.23-.5-.5V14.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0-3c0 .28-.22.5-.5.5H5.49c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.22.5-.5.5H5.49c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5" />
              <path d="M13 30h-2.98v-4.65c0-.2.16-.35.35-.35h2.28c.19 0 .35.15.35.35zm-4.02-4.65V30H6v-4.65c0-.2.15-.35.35-.35h2.28c.2 0 .35.16.35.35" />
            </g>
          </svg>
        ),
        link: "/department/classes",
      },
      {
        name: "Quản lý sinh viên",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            >
              <path d="M2.5 6L8 4l5.5 2L11 7.5V9s-.667-.5-3-.5S5 9 5 9V7.5zm0 0v4" />
              <path d="M11 8.5v.889c0 1.718-1.343 3.111-3 3.111s-3-1.393-3-3.111V8.5m10.318 2.53s.485-.353 2.182-.353s2.182.352 2.182.352m-4.364 0V10L13.5 9l4-1.5l4 1.5l-1.818 1v1.03m-4.364 0v.288a2.182 2.182 0 1 0 4.364 0v-.289M4.385 15.926c-.943.527-3.416 1.602-1.91 2.947C3.211 19.53 4.03 20 5.061 20h5.878c1.03 0 1.85-.47 2.586-1.127c1.506-1.345-.967-2.42-1.91-2.947c-2.212-1.235-5.018-1.235-7.23 0M16 20h3.705c.773 0 1.387-.376 1.939-.902c1.13-1.076-.725-1.936-1.432-2.357A5.34 5.34 0 0 0 16 16.214" />
            </g>
          </svg>
        ),
        link: "/department/students",
      },
    ],
    Lecturer: [
      // ...commonMenu,
      {
        name: "Quản lý lớp học",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M9 4h2v5l-1-.75L9 9zm9 16H6V4h1v9l3-2.25L13 13V4h5z"
            />
          </svg>
        ),
        link: "/lecturer/classes",
      },
    ],
    Student: [
      // ...commonMenu,
      {
        name: "Danh sách lớp học",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M9 4h2v5l-1-.75L9 9zm9 16H6V4h1v9l3-2.25L13 13V4h5z"
            />
          </svg>
        ),
        link: "/student/classes",
      },
    ],
  };

  // const menuSidebar = [
  //   {
  //     name: "Quản lý khoa",
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="1em"
  //         height="1em"
  //         viewBox="0 0 32 32"
  //       >
  //         <g fill="currentColor">
  //           <path d="M28.99 30V16.98c0-.54-.44-.99-.99-.99h-8V12h2v1.19c0 .45.36.81.8.81h3.39c.45 0 .81-.36.81-.8V4.81c0-.45-.36-.81-.8-.81h-3.39c-.45 0-.81.36-.81.81V6h-2V2.92c0-.51-.41-.92-.92-.92H3.92c-.51 0-.92.41-.92.92v27.06h1.98v-4.95c0-.57.46-1.03 1.03-1.03h10.96c.57 0 1.03.46 1.03 1.03V30h-.99v-4.65c0-.19-.15-.35-.35-.35h-2.28c-.19 0-.35.15-.35.35V30H11zM20 27.01V24h1.5c.28 0 .5.23.5.5v2c0 .28-.22.5-.5.51zm0-5V19h1.5c.28 0 .5.23.5.5v2c0 .28-.22.5-.5.51zM22 11h-2V7h2zm5 8.5v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0 5v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V24.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m-13.99-20v2c0 .28-.22.5-.5.5h-2.02c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0 7c0 .28-.22.5-.5.5h-2.02c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0 3v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V14.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0 5v2c0 .28-.22.5-.5.51h-2.02c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m5.01 2c0 .28-.23.5-.5.51H15.5c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.23.5-.5.51H15.5c-.28 0-.5-.23-.5-.5V14.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0-3c0 .28-.23.5-.5.5H15.5c-.28 0-.5-.23-.5-.5v-2c0-.28.22-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.23.5-.5.5H15.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5h2.02c.28 0 .5.23.5.5m-10.01 17c0 .28-.22.5-.5.51H5.49c-.28 0-.5-.23-.5-.5V19.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.22.5-.5.51H5.49c-.28 0-.5-.23-.5-.5V14.5c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5m0-3c0 .28-.22.5-.5.5H5.49c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5zm0-7v2c0 .28-.22.5-.5.5H5.49c-.28 0-.5-.23-.5-.5v-2c0-.28.23-.5.5-.5h2.02c.28 0 .5.23.5.5" />
  //           <path d="M13 30h-2.98v-4.65c0-.2.16-.35.35-.35h2.28c.19 0 .35.15.35.35zm-4.02-4.65V30H6v-4.65c0-.2.15-.35.35-.35h2.28c.2 0 .35.16.35.35" />
  //         </g>
  //       </svg>
  //     ),
  //     link: "/department",
  //   },
  //   {
  //     name: "Quản lý lớp học",
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="1em"
  //         height="1em"
  //         viewBox="0 0 24 24"
  //       >
  //         <path
  //           fill="currentColor"
  //           d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M9 4h2v5l-1-.75L9 9zm9 16H6V4h1v9l3-2.25L13 13V4h5z"
  //         />
  //       </svg>
  //     ),
  //     link: "/class",
  //   },
  //   {
  //     name: "Danh sách lớp học",
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="1em"
  //         height="1em"
  //         viewBox="0 0 16 16"
  //       >
  //         <path
  //           fill="currentColor"
  //           fillRule="evenodd"
  //           d="M2.5 5.5v-3h3v3zM1 2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm8 .25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.25M9.75 5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zM2.5 10.5v3h3v-3zM2 9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zm7.75.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     ),
  //     link: "/",
  //   },
  // ];

  const isActive = (menuLink: string) => {
    if (menuLink === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(menuLink);
  };

  return (
    <div className="flex flex-col h-full justify-between w-full h-screen sticky top-0 bg-white border-r border-[#E2E8F0] sm:max-w-[270px]">
      <div className="p-2 ">
        {/* logo */}
        <div className="flex flex-col items-center justify-center gap-2 mb-4 p-[12px]">
          <img
            src="https://thanglong.edu.vn/themes/md_tlu/img/logo.svg"
            alt=""
            className="h-[50px] w-full object-contain"
          />
          <div>
            {/* <h6 className="!font-bold">Phòng đào tạo</h6> */}
            <p className="!text-[12px] text-center font-semibold">
              Hệ thống chấm điểm danh
            </p>
          </div>
        </div>
        {/* Menu Sidebar */}
        <div>
          <ul className="font-semibold">
            {(role === "Quan_tri" || role === "Thu_ky") && (
              <>
                {menuSidebar.Department.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    // onClick={() => setIsSelected(item.link)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-[8px] cursor-pointer hover:bg-[#F4E6E6] hover:text-[#8B0000] ${
                      pathname === item.link
                        ? "bg-[#F4E6E6] text-[#8B0000]"
                        : "text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}

            {role === "Giang_vien" && (
              <>
                {menuSidebar.Lecturer.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    // onClick={() => setIsSelected(item.link)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-[8px] cursor-pointer hover:bg-[#F4E6E6] hover:text-[#8B0000] ${
                      isActive(item.link)
                        ? "bg-[#F4E6E6] text-[#8B0000]"
                        : "text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
            {/* <h6 className="text-center">Student</h6>
            {menuSidebar.Student.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                // onClick={() => setIsSelected(item.link)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-[8px] cursor-pointer hover:bg-[#F4E6E6] hover:text-[#8B0000] ${
                  pathname === item.link
                    ? "bg-[#F4E6E6] text-[#8B0000]"
                    : "text-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))} */}
          </ul>
        </div>
      </div>
      <div className=" border-t border-[#E2E8F0] w-full p-2">
        <div className="bg-[#F8FAFC] p-2 rounded-2xl flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <div className="p-2 bg-[#EBF0FD] rounded-full w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2a5 5 0 1 0 5 5a5 5 0 0 0-5-5m0 8a3 3 0 1 1 3-3a3 3 0 0 1-3 3m9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"
                />
              </svg>
            </div>
            <div className="whitespace-nowrap">
              <p className="!text-[14px] !font-bold">
                {profile?.ten || "User"}
              </p>
              {profile?.role === "Giang_vien" ? (
                <p className="!text-[12px] ">Giảng viên</p>
              ) : profile?.role === "Quan_tri" ? (
                <p className="!text-[12px]">Quản trị viên</p>
              ) : profile?.role === "Thu_ky" ? (
                <p className="!text-[12px]">Thư ký</p>
              ) : profile?.role === "Sinh_vien" ? (
                <p className="!text-[12px]">Sinh viên</p>
              ) : null}
            </div>
          </div>
          <div className="p-2 hover:bg-[#EBF0FD] flex items-center rounded-full cursor-pointer">
            <button onClick={() => handleLogout()}>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="text-[#64748B]"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="2"
                  d="M15.5 16.5L20 12l-4.5-4.5m3.25 4.5H9m0 8.5H4v-17h5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
