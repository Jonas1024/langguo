import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export const baseURL = process.env.NEXT_PUBLIC_API_URL

const service: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosGet = async <T = unknown>(
  url: string,  
  params?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await service.get<T>(url, {
    params,
    ...config,
  });
  return response.data;
};

export const axiosPost = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await service.post<T>(url, data, {
    ...config,
  });
  return response.data;
};

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error in request to ${error.config?.url}: ${error.message}`
      );

      if (error.response) {
        console.error(
          `Server responded with status ${error.response.status}:`,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    return Promise.reject(error);
  }
);