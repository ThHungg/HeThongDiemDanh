import axiosInstance from "./axiosInstance";

export const loginService = async (userCode: string) => {
  try {
    const res = await axiosInstance.post(
      "/auth/sendOtp",
      { userCode },
      { headers: { skipAuth: true } },
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const verifyOtpService = async (userCode: string, otp: string) => {
  try {
    const res = await axiosInstance.post(
      "/auth/verifyOtp",
      { userCode, otp },
      { headers: { skipAuth: true } },
    );
    return res.data;
  } catch (e) {
    throw e;
  }
}

export const logoutService = async () => {
  try {
    const res = await axiosInstance.post("/auth/logout", {}, { headers: { skipAuth: true } });
    return res.data;
  } catch (e) {
    throw e;
  }
}
