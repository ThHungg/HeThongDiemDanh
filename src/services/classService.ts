import axiosInstance from "./axiosInstance";

export const getAllSemestersService = async () => {
  try {
    const res = await axiosInstance.get("/semesters");
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getClassesByLecturerService = async () => {
  try {
    const semesterData = localStorage.getItem("semester-data");

    const semester = semesterData
      ? JSON.parse(semesterData).state.selectedSemester
      : "";
    const res = await axiosInstance.get("/classes/lecturer/myClasses", {
      params: {
        semester: semester,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getDetailClassByLecturerService = async (classCode: string) => {
    try {
        const res = await axiosInstance.get(`/classes/lecturer/myClasses/${classCode}`);
        return res.data;
    } catch (e) {
         throw e;
    }
}

export const getAllClassesService = async () => {
  try {
    const semesterData = localStorage.getItem("semester-data");

    const semester = semesterData
      ? JSON.parse(semesterData).state.selectedSemester
      : "";
    const res = await axiosInstance.get("/classes/getAll", {
      params: {
        semester: semester,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

//Student

export const getClassesByStudentService = async () => {
    try {
        const res = await axiosInstance.get("/classes/student/myClasses?");
        return res.data;
    } catch (e) {
        throw e;
    }
}
