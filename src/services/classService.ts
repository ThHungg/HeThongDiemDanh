import axiosInstance from "./axiosInstance";

export const getAllSemestersService = async () => {
  try {
    const res = await axiosInstance.get("/semesters");
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getCurrentSemesterService = async () => {
  try {
    const res = await axiosInstance.get("/semesters/current");
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
    const res = await axiosInstance.get(
      `/classes/lecturer/myClasses/${classCode}`,
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getAllClassesService = async (options: any = {}) => {
  try {
    const semesterData = localStorage.getItem("semester-data");

    const semester = options.semester || (semesterData
      ? JSON.parse(semesterData).state.selectedSemester
      : "");

    const params: any = {
      semester,
      page: options.page || 1,
      limit: options.limit || 10,
      searchText: options.searchText || "",
    };

    if (options.lecturerId) params.lecturerId = options.lecturerId;

    const res = await axiosInstance.get("/classes/getAll", { params });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getCurrentClass = async () => {
  try {
    const res = await axiosInstance.get("/classes/getCurrentClasses")
    return res.data;
  } catch (e) {
    throw e;
  }
}

//Student

export const getClassesByStudentService = async () => {
  try {
    const res = await axiosInstance.get("/classes/student/myClasses?");
    return res.data;
  } catch (e) {
    throw e;
  }
};


// Lecturer
export const getAllLecturerService = async () => {
  try {
    const res = await axiosInstance.get("/classes/getAllLecturer");
    return res.data;
  } catch (e) {
    throw e;
  }
}