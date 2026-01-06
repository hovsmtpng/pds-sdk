// src/api/apiCall.ts
import apiService from "@/api/interceptor";
import type { AxiosRequestConfig, Method } from "axios";

/* =========================
   Types
========================= */

export type ApiParams = Record<string, unknown>;

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: unknown;
}

/* =========================
   Function
========================= */

export async function apiCall<T = unknown>(
  endpoint: string,
  method: Method = "POST",
  params: ApiParams = {}
): Promise<ApiResponse<T>> {
  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
  };

  if (method === "POST" || method === "PUT") {
    config.data = params;
  } else {
    config.params = params;
  }

  const response = await apiService(config);
  return response.data;
}