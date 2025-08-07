import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../../store";
import { Role } from "/app/shared/user-role-identifier";
import { UnauthorizedPage } from "./UnauthorisedPage";
import { NavigationPath } from "../../../navigation";

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
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.currentUser.authUser);
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const isAuthenticated = !!authUser;
  
  // Check if user data is still loading (Meteor.userId() exists but Redux state not loaded yet)
  const isLoading = Meteor.userId() && !authUser;

  useEffect(() => {
    // If not authenticated, redirect to signin
    if (!isAuthenticated && !isLoading) {
      navigate(NavigationPath.Signin, { state: { from: location }, replace: true });
      return;
    }

    // If user is authenticated but doesn't have the required role and not showing unauthorized page
    if (isAuthenticated && !allowedRoles.includes(authUser.role) && !showUnauthorizedPage) {
      // Fallback to redirect if showUnauthorizedPage is false
      const roleDashboardMap: Record<Role, string> = {
        [Role.AGENT]: NavigationPath.AgentDashboard,
        [Role.TENANT]: NavigationPath.TenantDashboard,
        [Role.LANDLORD]: NavigationPath.LandlordDashboard,
      };

      const defaultRedirect = roleDashboardMap[authUser.role] || NavigationPath.Home;
      const redirectPath = redirectTo || defaultRedirect;

      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, authUser, allowedRoles, showUnauthorizedPage, redirectTo, navigate, location]);

  // If still loading user data, show loading or wait
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, return null (navigation will happen in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If user is authenticated but doesn't have the required role
  if (!allowedRoles.includes(authUser.role)) {
    if (showUnauthorizedPage) {
      return <UnauthorizedPage />;
    }
    // Return null (navigation will happen in useEffect)
    return null;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};
