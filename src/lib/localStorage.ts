import type { AuthSession } from "@/types/models";

const AUTH_KEY = "pms-auth-session";

export const loadAuthSession = (): AuthSession | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const saveAuthSession = (session: AuthSession | null): void => {
  if (!session) {
    localStorage.removeItem(AUTH_KEY);
    return;
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
};
