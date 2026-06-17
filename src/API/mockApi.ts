import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type {
  AuthSession,
  DashboardSummary,
  Item,
  ItemListQuery,
  PagedResult,
  Product,
  ProductListQuery,
  User,
  UserRole,
} from "@/types/models";

interface StoredUser extends User {
  password: string;
}

interface RefreshRecord {
  token: string;
  userId: number;
  expiresAt: number;
  revoked: boolean;
}

interface MockDatabase {
  users: StoredUser[];
  products: Product[];
  items: Item[];
  refreshTokens: RefreshRecord[];
  sequence: {
    user: number;
    product: number;
    item: number;
  };
}

const DB_KEY = "pms-db-v1";
const ACCESS_TOKEN_TTL_MS = 1000 * 60 * 10;
const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const nowIso = () => new Date().toISOString();

const encodeToken = (payload: { sub: number; role: UserRole; exp: number }): string =>
  btoa(JSON.stringify(payload));

const decodeToken = (token: string): { sub: number; role: UserRole; exp: number } | null => {
  try {
    const parsed = JSON.parse(atob(token)) as { sub: number; role: UserRole; exp: number };
    if (!parsed.sub || !parsed.role || !parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const createInitialDb = (): MockDatabase => {
  const createdOn = nowIso();
  return {
    users: [
      {
        id: 1,
        name: "System Admin",
        email: "admin@pms.local",
        password: "Admin@123",
        role: "Admin",
      },
      {
        id: 2,
        name: "Operations Manager",
        email: "manager@pms.local",
        password: "Manager@123",
        role: "Manager",
      },
      {
        id: 3,
        name: "Read Only User",
        email: "viewer@pms.local",
        password: "Viewer@123",
        role: "Viewer",
      },
    ],
    products: [
      {
        id: 1,
        productName: "Laptop Pro 16",
        createdBy: "System Admin",
        createdOn,
      },
      {
        id: 2,
        productName: "Wireless Keyboard",
        createdBy: "Operations Manager",
        createdOn,
      },
    ],
    items: [
      { id: 1, productId: 1, quantity: 25 },
      { id: 2, productId: 2, quantity: 140 },
    ],
    refreshTokens: [],
    sequence: {
      user: 3,
      product: 2,
      item: 2,
    },
  };
};

const loadDb = (): MockDatabase => {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seeded = createInitialDb();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(raw) as MockDatabase;
  } catch {
    const seeded = createInitialDb();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

const saveDb = (db: MockDatabase): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const cleanUser = (user: StoredUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const authError = (): never => {
  const error = {
    status: 401,
    message: "Unauthorized",
  };
  throw error;
};

const parseAccessToken = (config: AxiosRequestConfig): User => {
  const db = loadDb();
  const headers = (config.headers as Record<string, string> | undefined) ?? {};
  const authHeader = headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    authError();
  }

  const token = authHeader!.replace("Bearer ", "").trim();
  const payload = decodeToken(token);
  if (!payload || payload.exp < Date.now()) {
    authError();
  }

  const user = db.users.find((entry) => entry.id === payload!.sub);
  if (!user) {
    authError();
  }

  return cleanUser(user!);
};

const buildSession = (db: MockDatabase, user: StoredUser): AuthSession => {
  const expiresAt = Date.now() + ACCESS_TOKEN_TTL_MS;
  const accessToken = encodeToken({ sub: user.id, role: user.role, exp: expiresAt });
  const refreshToken = `${crypto.randomUUID()}-${user.id}`;

  db.refreshTokens = db.refreshTokens.filter((entry) => !entry.revoked && entry.expiresAt > Date.now());
  db.refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL_MS,
    revoked: false,
  });

  saveDb(db);

  return {
    user: cleanUser(user),
    tokens: {
      accessToken,
      refreshToken,
      expiresAt,
    },
  };
};

const paged = <T>(data: T[], page: number, pageSize: number): PagedResult<T> => {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const start = (safePage - 1) * safePageSize;
  return {
    data: data.slice(start, start + safePageSize),
    total: data.length,
    page: safePage,
    pageSize: safePageSize,
  };
};

const ok = <T>(data: T, config: AxiosRequestConfig, status = 200): AxiosResponse<T> => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config: {
    ...config,
    headers: config.headers ?? {},
  } as InternalAxiosRequestConfig,
});

const getPath = (config: AxiosRequestConfig) => (config.url ?? "").replace(/^\/api\/v1/, "");

const ensureRole = (user: User, allowed: UserRole[]): void => {
  if (!allowed.includes(user.role)) {
    throw { status: 403, message: "Forbidden" };
  }
};

export const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  await delay();

  const db = loadDb();
  const method = (config.method ?? "get").toLowerCase();
  const path = getPath(config);

  try {
    if (path === "/auth/login" && method === "post") {
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as { email: string; password: string };
      const user = db.users.find((entry) => entry.email.toLowerCase() === body.email.toLowerCase());
      if (!user || user.password !== body.password) {
        throw { status: 400, message: "Invalid credentials" };
      }
      return ok(buildSession(db, user), config);
    }

    if (path === "/auth/register" && method === "post") {
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as {
        name: string;
        email: string;
        password: string;
        role: UserRole;
      };

      if (db.users.some((entry) => entry.email.toLowerCase() === body.email.toLowerCase())) {
        throw { status: 409, message: "Email already exists" };
      }

      db.sequence.user += 1;
      const user: StoredUser = {
        id: db.sequence.user,
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
      };
      db.users.push(user);
      saveDb(db);
      return ok(buildSession(db, user), config, 201);
    }

    if (path === "/auth/refresh" && method === "post") {
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as { refreshToken: string };
      const refreshRecord = db.refreshTokens.find((entry) => entry.token === body.refreshToken);
      if (!refreshRecord || refreshRecord.revoked || refreshRecord.expiresAt < Date.now()) {
        throw { status: 401, message: "Invalid refresh token" };
      }

      refreshRecord.revoked = true;
      const user = db.users.find((entry) => entry.id === refreshRecord.userId);
      if (!user) {
        throw { status: 401, message: "Invalid refresh token" };
      }
      saveDb(db);
      return ok(buildSession(db, user), config);
    }

    if (path === "/auth/logout" && method === "post") {
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as { refreshToken: string };
      const refreshRecord = db.refreshTokens.find((entry) => entry.token === body.refreshToken);
      if (refreshRecord) {
        refreshRecord.revoked = true;
        saveDb(db);
      }
      return ok({ success: true }, config);
    }

    const currentUser = parseAccessToken(config);

    if (path === "/dashboard/summary" && method === "get") {
      const summary: DashboardSummary = {
        productCount: db.products.length,
        itemCount: db.items.length,
        lowStockItems: db.items.filter((entry) => entry.quantity < 30).length,
      };
      return ok(summary, config);
    }

    if (path === "/products" && method === "get") {
      const query = (config.params ?? {}) as Partial<ProductListQuery>;
      const search = query.search?.toLowerCase().trim() ?? "";
      const sortBy = query.sortBy ?? "createdOn";
      const sortDirection = query.sortDirection ?? "desc";

      const filtered = db.products.filter((entry) => entry.productName.toLowerCase().includes(search));
      const sorted = [...filtered].sort((a, b) => {
        const left = sortBy === "productName" ? a.productName.toLowerCase() : a.createdOn;
        const right = sortBy === "productName" ? b.productName.toLowerCase() : b.createdOn;
        const base = left > right ? 1 : left < right ? -1 : 0;
        return sortDirection === "asc" ? base : -base;
      });

      return ok(paged(sorted, Number(query.page) || 1, Number(query.pageSize) || 10), config);
    }

    if (path.startsWith("/products/") && method === "get") {
      const id = Number(path.split("/")[2]);
      const product = db.products.find((entry) => entry.id === id);
      if (!product) {
        throw { status: 404, message: "Product not found" };
      }
      return ok(product, config);
    }

    if (path === "/products" && method === "post") {
      ensureRole(currentUser, ["Admin", "Manager"]);
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as { productName: string };
      db.sequence.product += 1;
      const product: Product = {
        id: db.sequence.product,
        productName: body.productName,
        createdBy: currentUser.name,
        createdOn: nowIso(),
      };
      db.products.push(product);
      saveDb(db);
      return ok(product, config, 201);
    }

    if (path.startsWith("/products/") && method === "put") {
      ensureRole(currentUser, ["Admin", "Manager"]);
      const id = Number(path.split("/")[2]);
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as { productName: string };
      const product = db.products.find((entry) => entry.id === id);
      if (!product) {
        throw { status: 404, message: "Product not found" };
      }
      product.productName = body.productName;
      product.modifiedBy = currentUser.name;
      product.modifiedOn = nowIso();
      saveDb(db);
      return ok(product, config);
    }

    if (path.startsWith("/products/") && method === "delete") {
      ensureRole(currentUser, ["Admin", "Manager"]);
      const id = Number(path.split("/")[2]);
      db.products = db.products.filter((entry) => entry.id !== id);
      db.items = db.items.filter((entry) => entry.productId !== id);
      saveDb(db);
      return ok({ success: true }, config);
    }

    if (path === "/items" && method === "get") {
      const query = (config.params ?? {}) as Partial<ItemListQuery>;
      const productId = query.productId ? Number(query.productId) : undefined;
      const sortDirection = query.sortDirection ?? "desc";
      const filtered = productId ? db.items.filter((entry) => entry.productId === productId) : db.items;
      const sorted = [...filtered].sort((a, b) => (sortDirection === "asc" ? a.id - b.id : b.id - a.id));
      return ok(paged(sorted, Number(query.page) || 1, Number(query.pageSize) || 10), config);
    }

    if (path.startsWith("/items/") && method === "get") {
      const id = Number(path.split("/")[2]);
      const item = db.items.find((entry) => entry.id === id);
      if (!item) {
        throw { status: 404, message: "Item not found" };
      }
      return ok(item, config);
    }

    if (path === "/items" && method === "post") {
      ensureRole(currentUser, ["Admin", "Manager"]);
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as { productId: number; quantity: number };
      const exists = db.products.some((entry) => entry.id === body.productId);
      if (!exists) {
        throw { status: 400, message: "Product does not exist" };
      }
      db.sequence.item += 1;
      const item: Item = {
        id: db.sequence.item,
        productId: body.productId,
        quantity: body.quantity,
      };
      db.items.push(item);
      saveDb(db);
      return ok(item, config, 201);
    }

    if (path.startsWith("/items/") && method === "put") {
      ensureRole(currentUser, ["Admin", "Manager"]);
      const id = Number(path.split("/")[2]);
      const body = (config.data ? JSON.parse(String(config.data)) : {}) as { quantity: number };
      const item = db.items.find((entry) => entry.id === id);
      if (!item) {
        throw { status: 404, message: "Item not found" };
      }
      item.quantity = body.quantity;
      saveDb(db);
      return ok(item, config);
    }

    if (path.startsWith("/items/") && method === "delete") {
      ensureRole(currentUser, ["Admin", "Manager"]);
      const id = Number(path.split("/")[2]);
      db.items = db.items.filter((entry) => entry.id !== id);
      saveDb(db);
      return ok({ success: true }, config);
    }

    throw { status: 404, message: "Endpoint not found" };
  } catch (error) {
    const typedError = error as { status?: number; message?: string };
    return Promise.reject({
      config,
      response: {
        status: typedError.status ?? 500,
        data: {
          message: typedError.message ?? "Unexpected error",
        },
      },
    });
  }
};
