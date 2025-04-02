import axios, { AxiosError, AxiosInstance } from "axios";

export const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

request.interceptors.request.use((config) => {
  if (config.headers && !config.headers.Accept) {
    config.headers.Accept = "application/json";
  }
  return config;
});

request.interceptors.response.use(
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