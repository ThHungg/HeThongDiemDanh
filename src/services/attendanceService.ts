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

export const exportAttendanceByClassService = async (classCode: string) => {
    try {
        const res = await axiosInstance.get(`/attendance/export/${classCode}`);
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const downloadAttendanceTemplateService = async (filename: string) => {
    try {
        const res = await axiosInstance.get(`/attendance/download/${filename}`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        return res.data;
    } catch (e) {
        throw e;
    }
}