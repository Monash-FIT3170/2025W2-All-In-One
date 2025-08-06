import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../../store";
import { Role } from "/app/shared/user-role-identifier";
import { UnauthorizedPage } from "./UnauthorizedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
  showUnauthorizedPage?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo,
  showUnauthorizedPage = true,
}) => {
  const location = useLocation();
  const authUser = useAppSelector((state) => state.currentUser.authUser);
  const isAuthenticated = !!authUser;

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user's role is not in allowed roles
  if (!allowedRoles.includes(authUser.role)) {
    if (showUnauthorizedPage) {
      return (
        <UnauthorizedPage
          requiredRole={allowedRoles.join(" or ")}
          currentRole={authUser.role}
        />
      );
    }

    // Fallback to redirect if showUnauthorizedPage is false
    const roleDashboardMap: Record<Role, string> = {
      [Role.AGENT]: "/agent-dashboard",
      [Role.TENANT]: "/tenant-dashboard",
      [Role.LANDLORD]: "/landlord-dashboard",
    };

    const defaultRedirect = roleDashboardMap[authUser.role] || "/";
    const redirectPath = redirectTo || defaultRedirect;

    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
}; 