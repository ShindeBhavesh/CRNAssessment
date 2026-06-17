import type { ReactNode } from "react";
import type { UserRole } from "@/types/models";
import { useAppSelector } from "@/store/hooks";

interface RoleGuardProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard = ({ roles, children, fallback = null }: RoleGuardProps) => {
  const userRole = useAppSelector((state) => state.auth.session?.user.role);
  return userRole && roles.includes(userRole) ? <>{children}</> : <>{fallback}</>;
};
