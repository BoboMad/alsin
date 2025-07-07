import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with every request
});

type QueueItem = {
  resolve: (value: AxiosResponse) => void;
  reject: (error: any) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, tokenValid = false) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(tokenValid as any); // Fake result, we retry request anyway
    }
  });

  failedQueue = [];
};

async function refreshToken() {
  try {
    const response = await axiosInstance.post("/refresh-token");
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

const DISABLED_INTERCEPTORS = ["/login", "/register", "/refresh-token"];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !DISABLED_INTERCEPTORS.some(path => originalRequest.url?.includes(path))
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          originalRequest._retry = true;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const success = await refreshToken();
        if (success) {
          processQueue(null, true);
          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error("Refresh failed"), false);
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, false);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);