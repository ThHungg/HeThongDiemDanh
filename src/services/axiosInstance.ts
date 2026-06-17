import axios, { InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Sử dụng biến môi trường từ file .env
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.88.202:3333/api/v1";

const axiosRefresh = axios.create({
  baseURL: API_URL,
});

const axiosInstance = axios.create({
  baseURL: API_URL,
});

interface JwtPayload {
  exp: number;
}

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
      return config;
    }

    // Sửa lỗi tự động xóa '/api/v1' khỏi baseURL
    if (config.url && config.url.startsWith("/")) {
      config.url = config.url.substring(1);
    }
    if (config.baseURL && !config.baseURL.endsWith("/")) {
      config.baseURL += "/";
    }

    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      const decoded: JwtPayload = jwtDecode(token);
      const expTime = decoded.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (expTime < currentTime) {
        try {
          const refreshToken = await AsyncStorage.getItem("refreshToken");
          const res = await axiosRefresh.post("/auth/refreshToken", { refreshToken });
          const { accessToken } = res.data;
          
          await AsyncStorage.setItem("accessToken", accessToken);
          if (config.headers) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          }
        } catch (e) {
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("refreshToken");
        }
      } else {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
