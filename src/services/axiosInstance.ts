import axios, { InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from 'jwt-decode';

const axiosRefresh = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

interface JwtPayload {
    exp: number;
}

axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
       // config.headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;
       if(config.headers?.skipAuth){
        delete config.headers.skipAuth
        return config
       }
       const token = localStorage.getItem("accessToken");
       if (token){
        const decoded: JwtPayload =jwtDecode(token);
        const expTime = decoded.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (expTime < currentTime){
            try {
                const res = await axiosRefresh.post("/auth/refreshToken");
                const { accessToken } = res.data;
                localStorage.setItem("accessToken", accessToken);
                if (config.headers) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
            } catch (e) {
                localStorage.removeItem("accessToken");
            }
        } else {
              config.headers["Authorization"] = `Bearer ${token}`;
        }
       }
       return config
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default axiosInstance

