import { api } from "../services/api";

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  role_id: number;
  status: boolean;
  file_id?: number | null;
  role?: {
    id: number;
    name: string;
  };
}

interface AuthStorage {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
  lastActivity: number;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

const STORAGE_KEY = "auth";
const IDLE_LIMIT = 15 * 60 * 1000;
const KEEP_CONNECTED_LIMIT = 7 * 24 * 60 * 60 * 1000;

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await api.post<LoginResponse>("/sessions", {
    username: credentials.username,
    password: credentials.password,
  });

  const { access_token, refresh_token, user } = response.data;

  const authData: AuthStorage = {
    access_token,
    refresh_token,
    user,
    lastActivity: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

  return user;
}

export async function logout(): Promise<void> {
  const auth = getAuth();

  if (auth?.refresh_token) {
    try {
      await api.post("/sessions/logout", {
        refresh_token: auth.refresh_token,
      });
    } catch (error) {
      console.error("Erro ao fazer logout na API:", error);
    }
  }

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("keepConnected");
  delete api.defaults.headers.common["Authorization"];
}

export function setTokens(access_token: string, refresh_token: string) {
  const auth = getAuth();
  if (auth) {
    auth.access_token = access_token;
    auth.refresh_token = refresh_token;
    auth.lastActivity = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  }
}

export function getAuth(): AuthStorage | null {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getUser(): AuthUser | null {
  return getAuth()?.user || null;
}

export function getUserName(): string {
  return getUser()?.name || "";
}

export function getUsername(): string {
  return getUser()?.username || "";
}

export function getUserRoleId(): number | null {
  return getUser()?.role_id || null;
}

export function isUserActive(): boolean {
  return getUser()?.status === true;
}

export function getAccessToken(): string | null {
  return getAuth()?.access_token || null;
}

export function getRefreshToken(): string | null {
  return getAuth()?.refresh_token || null;
}

function getIdleLimit(): number {
  const keepConnected = localStorage.getItem("keepConnected") === "true";
  return keepConnected ? KEEP_CONNECTED_LIMIT : IDLE_LIMIT;
}

export function updateActivity() {
  const auth = getAuth();
  if (!auth) return;

  auth.lastActivity = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function isAuthenticated(): boolean {
  const auth = getAuth();

  if (!auth?.access_token) return false;
  if (!isUserActive()) return false;

  const tokenExpired = isTokenExpired(auth.access_token);
  if (tokenExpired) return false;

  const idleLimit = getIdleLimit();
  const now = Date.now();
  const isIdle = now - auth.lastActivity > idleLimit;

  if (isIdle) {
    logout();
    return false;
  }

  return true;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function getTokenPayload() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
