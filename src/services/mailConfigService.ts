import axiosInstance from "./axiosInstance";

export const getMailConfigs = async () => {
  try {
    const res = await axiosInstance.get("/mailConfig");
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const updateMailConfig = async (id: string, data: any) => {
  try {
    const res = await axiosInstance.put(`/mailConfig/${id}`, data);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const createMailConfig = async (data: any) => {
  try {
    const res = await axiosInstance.post("/mailConfig", data);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteMailConfig = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/mailConfig/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const sendMailNow = async (id: string) => {
  try {
    const res = await axiosInstance.post(`/mailConfig/send-now/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};