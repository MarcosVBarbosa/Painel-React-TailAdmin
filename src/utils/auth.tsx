export interface AuthUser {
  nome: string;
  usuario: string;
  nivel: "Administrador" | "Básico";
  avatar?: string;
}

interface AuthStorage {
  token: string;
  user: AuthUser;
  lastActivity: number;
}

const STORAGE_KEY = "auth";
const IDLE_LIMIT = 15 * 60 * 1000; // 15 minutos

export function login(user: AuthUser) {
  const data: AuthStorage = {
    token: "fake-token-123",
    user,
    lastActivity: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
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

export function updateActivity() {
  const auth = getAuth();
  if (!auth) return;

  auth.lastActivity = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function isAuthenticated(): boolean {
  const auth = getAuth();

  if (!auth) return false;

  const now = Date.now();
  const isExpired = now - auth.lastActivity > IDLE_LIMIT;

  if (isExpired) {
    logout();
    return false;
  }

  return true;
}
