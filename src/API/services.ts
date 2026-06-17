import { api } from "@/api/client";
import type {
  AuthSession,
  DashboardSummary,
  Item,
  ItemListQuery,
  PagedResult,
  Product,
  ProductListQuery,
  UserRole,
} from "@/types/models";

type ApiEnvelope<T> = {
  succeeded?: boolean;
  success?: boolean;
  message?: string;
  data: T;
};

type BackendPaged<T> = {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
};

type AuthResponseDto = {
  accessToken: string;
  accessTokenExpiresOn: string;
  refreshToken: string;
  refreshTokenExpiresOn: string;
  email: string;
  role: UserRole;
};

const decodeUserIdFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const sub = payload.sub ?? payload.nameid;
    return Number(sub) || 0;
  } catch {
    return 0;
  }
};

const toAuthSession = (response: AuthSession | ApiEnvelope<AuthResponseDto>): AuthSession => {
  if ("user" in response) {
    return response;
  }

  const dto = response.data;
  return {
    user: {
      id: decodeUserIdFromToken(dto.accessToken),
      name: dto.email,
      email: dto.email,
      role: dto.role,
    },
    tokens: {
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      expiresAt: new Date(dto.accessTokenExpiresOn).getTime(),
    },
  };
};

const unwrapEnvelope = <T>(payload: T | ApiEnvelope<T>): T => {
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
};

const toPaged = <T>(payload: PagedResult<T> | BackendPaged<T>): PagedResult<T> => {
  if ("total" in payload) {
    return payload;
  }

  return {
    data: payload.data,
    total: payload.totalCount,
    page: payload.pageNumber,
    pageSize: payload.pageSize,
  };
};

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const response = await api.post<AuthSession | ApiEnvelope<AuthResponseDto>>("/auth/login", payload);
    return toAuthSession(response.data);
  },
  register: async (payload: { name: string; email: string; password: string; role: UserRole }) => {
    const response = await api.post<AuthSession | ApiEnvelope<AuthResponseDto>>("/auth/register", {
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });
    return toAuthSession(response.data);
  },
  logout: async (refreshToken: string) => {
    await api.post("/auth/logout", { refreshToken });
  },
};

export const dashboardApi = {
  summary: async () => {
    const response = await api.get<DashboardSummary | ApiEnvelope<DashboardSummary>>("/dashboard/summary");
    return unwrapEnvelope(response.data);
  },
};

export const productApi = {
  list: async (query: ProductListQuery) => {
    const response = await api.get<ApiEnvelope<BackendPaged<Product>> | PagedResult<Product>>(
      "/products",
      {
        params: {
          pageNumber: query.page,
          pageSize: query.pageSize,
          search: query.search,
          sortBy: query.sortBy === "createdOn" ? "CreatedOn" : "ProductName",
          sortOrder: query.sortDirection,
        },
      }
    );
    const payload = response.data as PagedResult<Product> | BackendPaged<Product> | ApiEnvelope<BackendPaged<Product>>;
    const normalized = "data" in payload && !Array.isArray(payload.data) && "totalCount" in payload.data ? payload.data : payload;
    return toPaged(normalized as PagedResult<Product> | BackendPaged<Product>);
  },
  getById: async (id: number) => {
    const response = await api.get<Product | ApiEnvelope<Product>>(`/products/${id}`);
    return unwrapEnvelope(response.data);
  },
  create: async (payload: { productName: string }) => {
    const response = await api.post<Product | ApiEnvelope<Product>>("/products", payload);
    return unwrapEnvelope(response.data);
  },
  update: async (id: number, payload: { productName: string }) => {
    const response = await api.put<Product | ApiEnvelope<Product>>(`/products/${id}`, payload);
    return unwrapEnvelope(response.data);
  },
  remove: async (id: number) => {
    await api.delete(`/products/${id}`);
  },
};

export const itemApi = {
  list: async (query: ItemListQuery) => {
    const response = await api.get<ApiEnvelope<BackendPaged<Item>> | PagedResult<Item>>(
      "/items",
      {
        params: {
          pageNumber: query.page,
          pageSize: query.pageSize,
          productId: query.productId,
        },
      }
    );
    const payload = response.data as PagedResult<Item> | BackendPaged<Item> | ApiEnvelope<BackendPaged<Item>>;
    const normalized = "data" in payload && !Array.isArray(payload.data) && "totalCount" in payload.data ? payload.data : payload;
    return toPaged(normalized as PagedResult<Item> | BackendPaged<Item>);
  },
  getById: async (id: number) => {
    const response = await api.get<Item | ApiEnvelope<Item>>(`/items/${id}`);
    return unwrapEnvelope(response.data);
  },
  create: async (payload: { productId: number; quantity: number }) => {
    const response = await api.post<Item | ApiEnvelope<Item>>("/items", payload);
    return unwrapEnvelope(response.data);
  },
  update: async (id: number, payload: { quantity: number }) => {
    const response = await api.put<Item | ApiEnvelope<Item>>(`/items/${id}`, payload);
    return unwrapEnvelope(response.data);
  },
  remove: async (id: number) => {
    await api.delete(`/items/${id}`);
  },
};
