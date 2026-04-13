import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setTokens, logout } from "../utils/auth";

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: "https://apiexpressbasic.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

// 🔹 Interceptor de request (adiciona access_token)
api.interceptors.request.use(
  (config): CustomAxiosRequestConfig => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config as CustomAxiosRequestConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 🔹 Controle de fila de requests durante refresh
let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 🔹 Interceptor de response (refresh token automático)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ❌ NÃO tentar refresh em rotas de auth
    const isAuthRoute =
      originalRequest.url === "/sessions" ||
      originalRequest.url === "/sessions/refresh" ||
      originalRequest.url === "/sessions/logout";

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // ❌ se não for 401 ou já tentou, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 🔁 Se já está atualizando token → entra na fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // 🔥 refresh usando cookie httpOnly (sem enviar body)
      const response = await api.post("/sessions/refresh");

      const { access_token } = response.data;

      // 🔐 salva apenas access_token
      setTokens(access_token);

      // 🔄 atualiza header da request original
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }

      // 🔓 libera fila
      processQueue(null, access_token);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);

      // 🔴 logout total
      await logout();

      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
