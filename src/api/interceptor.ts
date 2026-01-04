import { generateHeaders } from "@/utils";
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_URL_ODONG as string;

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = generateHeaders();

    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        config.headers.set(key, value);
      }
    });

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiService;