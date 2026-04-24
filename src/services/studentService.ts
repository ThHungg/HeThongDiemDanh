import axiosInstance from "./axiosInstance"

export const getStudentByIdService = async (studentId: string) => {
    try {
        const res = await axiosInstance.get(`/students/${studentId}`);
        return res.data;
    } catch (e) {
        throw e
    }
}