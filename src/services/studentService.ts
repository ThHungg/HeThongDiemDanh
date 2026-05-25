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
export const getAllStudentsService = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  startDate?: string,
  endDate?: string,
  minScore?: string,
  maxScore?: string,
  maLop?: string
) => {
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
        startDate,
        endDate,
        minScore,
        maxScore,
        maLop,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getClassesByStudentId = async (studentId: string) => {
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
    return res.data;
    } catch (e) {
        throw e;
    }
}


export const getAttendanceByStudentId = async (classCode: string) => {
    try {
         const semesterData = localStorage.getItem("semester-data");
    const semester = semesterData
      ? JSON.parse(semesterData).state.selectedSemester
      : "";
    const res = await axiosInstance.get(`/students/attend/${classCode}`, {
      params: {
        semester: semester,
      
      },
    });
    return res.data;
    } catch (e) {
        throw e;
    }
}

export const getSpecificStudentAttendance = async (classCode: string, studentId: string) => {
    try {
         const semesterData = localStorage.getItem("semester-data");
    const semester = semesterData
      ? JSON.parse(semesterData).state.selectedSemester
      : "";
    const res = await axiosInstance.get(`/students/attend/${classCode}/${studentId}`, {
      params: {
        semester: semester,
      
      },
    });
    return res.data;
    } catch (e) {
        throw e;
    }
}

export const getCoVanFilterDataService = async (khoa?: string, nganh?: string, maLop?: string) => {
  try {
    const res = await axiosInstance.get("/students/getFilterData", {
      params: {
        khoa,
        nganh,
        maLop
      }
    });
    return res.data;
  } catch (e) {
    throw e;
  }
}
