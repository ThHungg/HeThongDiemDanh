import axiosInstance from "./axiosInstance";

export const getStudentByIdService = async (studentId: string) => {
  try {
    const res = await axiosInstance.get(`/students/profile/${studentId}`);
    return res.data;
  } catch (e: any) {
    console.log("Error in getStudentByIdService:", e.response?.data || e.message);
    throw e;
  }
};

export const getClassesByStudentService = async () => {
  try {
    const res = await axiosInstance.get(`/students/myClasses`);
    return res.data;
  } catch (e: any) {
    console.log("Error in getClassesByStudentService:", e.response?.data || e.message);
    throw e;
  }
};

export const getClassesByStudentId = async (studentId: string, semester?: string | null) => {
  try {
      const res = await axiosInstance.get(`/students/${studentId}/classes`, {
        params: {
          semester: semester || "",
        },
      });
      return res.data;
  } catch (e) {
      throw e;
  }
}

export const getAttendanceByStudentId = async (classCode: string, semester?: string | null) => {
  try {
      const res = await axiosInstance.get(`/students/attend/${classCode}`, {
        params: {
          semester: semester || "",
        },
      });
      return res.data;
  } catch (e) {
      throw e;
  }
}

export const getSpecificStudentAttendance = async (classCode: string, studentId: string, semester?: string | null) => {
  try {
      const res = await axiosInstance.get(`/students/attend/${classCode}/${studentId}`, {
        params: {
          semester: semester || "",
        },
      });
      return res.data;
  } catch (e) {
      throw e;
  }
}
