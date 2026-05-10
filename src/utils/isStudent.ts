import { jwtDecode } from "jwt-decode";

export const isStudentRole = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
     const token = localStorage.getItem("accessToken");
    console.log("token", token);
    if (!token) return false;
    
    const decoded = jwtDecode<{ role: string }>(token);
    return decoded.role === "Sinh_vien";
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export default isStudentRole;
