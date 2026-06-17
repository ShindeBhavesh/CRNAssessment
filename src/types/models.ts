export type UserRole = "Admin" | "Manager" | "Viewer";

export interface AuditFields {
  createdBy: string;
  createdOn: string;
  modifiedBy?: string;
  modifiedOn?: string;
}

export interface Product extends AuditFields {
  id: number;
  productName: string;
}

export interface Item {
  id: number;
  productId: number;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface ProductListQuery {
  page: number;
  pageSize: number;
  search: string;
  sortBy: "productName" | "createdOn";
  sortDirection: "asc" | "desc";
}

export interface ItemListQuery {
  page: number;
  pageSize: number;
  productId?: number;
  sortDirection: "asc" | "desc";
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardSummary {
  productCount: number;
  itemCount: number;
  lowStockItems: number;
}
