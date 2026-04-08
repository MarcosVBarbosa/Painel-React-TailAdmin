import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  logout,
} from "../utils/auth";

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
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config): CustomAxiosRequestConfig => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config as CustomAxiosRequestConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

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

// Interceptor para tratar token expirado
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ⚠️ NÃO tentar refresh nas rotas de autenticação
    const isAuthRoute =
      originalRequest.url === "/sessions" ||
      originalRequest.url === "/sessions/refresh" ||
      originalRequest.url === "/sessions/logout";

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // Se não for erro 401 ou já tentou refresh, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refresh_token = getRefreshToken();

      if (!refresh_token) {
        throw new Error("Refresh token não encontrado");
      }

      const response = await api.post("/sessions/refresh", {
        refresh_token,
      });

      const { access_token, refresh_token: new_refresh_token } = response.data;

      setTokens(access_token, new_refresh_token || refresh_token);

      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
      }

      processQueue(null, access_token);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
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
