import apiService from "@/api/interceptor";
import { type AxiosRequestConfig, type Method } from "axios";

type ApiMethod = Method;

export async function apiCall<T = unknown>(
  endpoint: string,
  method: ApiMethod = "POST",
  params: Record<string, any> = {}
): Promise<T> {
  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
  };

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    config.data = params;
  } else {
    config.params = params;
  }

  const response = await apiService(config);
  return response.data as T;
}