import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../../store";
import { Role } from "/app/shared/user-role-identifier";
import { UnauthorizedPage } from "./UnauthorisedPage";

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
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const isAuthenticated = !!authUser;
  
  // Check if user data is still loading (Meteor.userId() exists but Redux state not loaded yet)
  const isLoading = Meteor.userId() && !authUser;

  // If still loading user data, show loading or wait
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (!allowedRoles.includes(authUser.role)) {
    if (showUnauthorizedPage) {
      return <UnauthorizedPage />;
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