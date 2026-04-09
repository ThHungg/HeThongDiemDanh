import AuthCard from "@/components/HomePage/AuthCard";
import { memo } from "react";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthCard />
    </div>
  );
};

export default memo(LoginPage);
