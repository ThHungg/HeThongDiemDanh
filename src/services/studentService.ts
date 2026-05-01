import axiosInstance from "./axiosInstance"

export const getStudentByIdService = async (studentId: string) => {
    try {
        const res = await axiosInstance.get(`/students/profile/${studentId}`);
        return res.data;
    } catch (e) {
        throw e
    }
}

export const getClassesByStudentService = async () => {
    try {
        const res = await axiosInstance.get(`/students/myClasses`);
        return res.data;
    } catch (e) {
        throw e
        
    }
}