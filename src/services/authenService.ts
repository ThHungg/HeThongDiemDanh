import axiosInstance from "./axiosInstance";

export const loginService = async (userCode: string) => {
  try {
    const res = await axiosInstance.post(
      "/auth/sendOtp",
      { userCode },
      { headers: { skipAuth: true } },
    );
  } catch (e) {
    throw e;
  }
};
