import axiosInstance from "./axiosInstance"

export const getAttendanceByClassService = async (classCode: string) => {
    try {
        const res = await axiosInstance.get(`/attendance/${classCode}`);
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const updateAttendanceByClassService = async (data: any) => {
    try {
        const res = await axiosInstance.post("/attendance/update", data);
        return res.data;
    } catch (e) {
        throw e
    }
}