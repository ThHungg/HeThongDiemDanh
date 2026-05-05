import axiosInstance from "./axiosInstance";

export const getStudentByIdService = async (studentId: string) => {
  try {
    const res = await axiosInstance.get(`/students/profile/${studentId}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getClassesByStudentService = async () => {
  try {
    const res = await axiosInstance.get(`/students/myClasses`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

//Department
export const getAllStudentsService = async (page: number = 1 , limit: number = 10, search?: string) => {
  try {
    const semesterData = localStorage.getItem("semester-data");
    const semester = semesterData
      ? JSON.parse(semesterData).state.selectedSemester
      : "";
    const res = await axiosInstance.get("/students", {
      params: {
        semester: semester,
        page,
        limit,
        search,
      },
    });
    console.log(res);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getClassesByStudentId = async (studentId: string, semester?: string) => {
    try {
         const semesterData = localStorage.getItem("semester-data");
    const semester = semesterData
      ? JSON.parse(semesterData).state.selectedSemester
      : "";
    const res = await axiosInstance.get(`/students/${studentId}/classes`, {
      params: {
        semester: semester,
      },
    });
    console.log(res);
    return res.data;
    } catch (e) {
        throw e;
    }
}
