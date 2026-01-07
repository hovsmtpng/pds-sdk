import apiService from '@/api/interceptor'
import type { AxiosRequestConfig, Method } from 'axios'

type ApiCallOptions = AxiosRequestConfig

export async function apiCall<T = any>(
  endpoint: string,
  method: Method = 'POST',
  params: Record<string, any> | FormData = {},
  options: ApiCallOptions = {}
): Promise<T> {

  console.log(endpoint)

  const isAbsoluteUrl = /^https?:\/\//i.test(endpoint)
  const isFormData =
    typeof FormData !== 'undefined' && params instanceof FormData

  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  }

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    config.data = params

    if (isFormData) {
      delete config.headers?.['Content-Type']
      delete config.headers?.['content-type']
    } else if (!isAbsoluteUrl || !config.headers?.['Content-Type']) {
      config.headers = {
        ...config.headers,
        'Content-Type': config.headers?.['Content-Type'] || 'application/json',
      }
    }
  } else {
    config.params = params
  }

  const response = await apiService<T>(config)
  return response.data
}