import { memo } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";

const MasterLayout = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  //   const pathname = usePathname();
  //   if (pathname === "/login") {
  //     return (
  //       <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
  //         {children}
  //       </div>
  //     );
  //   }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default memo(MasterLayout);
