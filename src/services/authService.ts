import axiosInstance from "./axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginService = async (userCode: string) => {
  try {
    const res = await axiosInstance.post(
      "/auth/sendOtp",
      { userCode },
      { headers: { skipAuth: true } }
    );
    return res.data;
  } catch (e: any) {
    console.log("API Error in authService:", e.response?.data || e.message);
    throw e;
  }
};

export const verifyOtpService = async (userCode: string, otp: string) => {
  try {
    const res = await axiosInstance.post(
      "/auth/verifyOtpApp",
      { userCode, otp },
      { headers: { skipAuth: true } }
    );
    return res.data;
  } catch (e: any) {
    console.log("API Error in authService:", e.response?.data || e.message);
    throw e;
  }
};

export const logoutService = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    
    const res = await axiosInstance.post(
      "/auth/logout",
      {},
      { headers: { skipAuth: true } }
    );
    return res.data;
  } catch (e: any) {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    console.log("Error in logoutService:", e.response?.data || e.message);
    throw e;
  }
};

export const getProfileService = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (e: any) {
    console.log("API Error in authService:", e.response?.data || e.message);
    throw e;
  }
};
