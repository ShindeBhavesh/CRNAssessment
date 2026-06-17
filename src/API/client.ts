import axios from "axios";
import { mockAdapter } from "@/api/mockApi";
import { store } from "@/store";
import { clearSession, setSession } from "@/store/authSlice";
import type { AuthSession } from "@/types/models";

type RetryConfig = {
  _retried?: boolean;
};

type RefreshEnvelope = {
  data: {
    accessToken: string;
    accessTokenExpiresOn: string;
    refreshToken: string;
    refreshTokenExpiresOn: string;
    email: string;
    role: "Admin" | "Manager" | "Viewer";
  };
};

const toSession = (payload: AuthSession | RefreshEnvelope): AuthSession => {
  if ("user" in payload) {
    return payload;
  }

  return {
    user: {
      id: 0,
      name: payload.data.email,
      email: payload.data.email,
      role: payload.data.role,
    },
    tokens: {
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
      expiresAt: new Date(payload.data.accessTokenExpiresOn).getTime(),
    },
  };
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
  adapter: import.meta.env.VITE_USE_MOCK_API === "true" ? mockAdapter : undefined,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.session?.tokens.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = (error.config ?? {}) as typeof error.config & RetryConfig;
    const status = error.response?.status as number | undefined;

    if (status !== 401 || originalConfig._retried || originalConfig.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    const currentSession = store.getState().auth.session;
    if (!currentSession?.tokens.refreshToken) {
      store.dispatch(clearSession());
      return Promise.reject(error);
    }

    originalConfig._retried = true;

    try {
      const refreshResponse = await api.post<AuthSession | RefreshEnvelope>("/auth/refresh", {
        refreshToken: currentSession.tokens.refreshToken,
      });

      const refreshedSession = toSession(refreshResponse.data);
      store.dispatch(setSession(refreshedSession));
      originalConfig.headers.Authorization = `Bearer ${refreshedSession.tokens.accessToken}`;
      return api(originalConfig);
    } catch {
      store.dispatch(clearSession());
      return Promise.reject(error);
    }
  }
);

export { api };
